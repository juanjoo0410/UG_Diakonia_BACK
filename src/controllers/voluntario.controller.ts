import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { VoluntarioService } from '../services/voluntario.service';
import { IVoluntario } from '../interfaces/voluntario.interface';
import { Voluntario } from '../models/Voluntario.model';
import { Institucion } from '../models/institucionModel';

const voluntarioService = new VoluntarioService();
const entidad = 'VOLUNTARIO';

export const create = async (
    req: Request<{}, {}, IVoluntario> & { user?: any },
    res: Response
) => {
    const voluntarioData: IVoluntario = req.body;
    try {
        const newVoluntario: Voluntario = await voluntarioService.createVoluntario(voluntarioData);
        res.status(201).json({
            status: true,
            message: 'Voluntario agregado exitosamente.',
            value: newVoluntario
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el voluntario ${voluntarioData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Voluntario ya existe.'
                });
                return;
            }
            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const update = async (
    req: Request<{}, {}, IVoluntario> & { user?: any },
    res: Response
) => {
    const voluntarioData: IVoluntario = req.body;
    try {
        const updatedVoluntario = await voluntarioService.updateVoluntario(voluntarioData);
        res.status(200).json({
            status: true,
            message: 'Datos de voluntario actualizados exitosamente',
            value: updatedVoluntario
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información del voluntario ${updatedVoluntario.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Voluntario no encontrado.'
            });
            return;
        }

        if (errorMessage === 'COINCIDENCIA_ENTIDAD') {
            res.status(400).json({
                status: false,
                message: 'La identificación del Voluntario ya existe.'
            });
            return;
        }

        return handleHttp(res, `ERROR_PUT_${entidad}`, error);
    }
};

export const updateStatus = async (
    req: Request<{ id: string }> & { user?: any },
    res: Response
) => {
    const id = req.params.id;
    try {
        const updatedVoluntario = await voluntarioService.updateVoluntarioStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del voluntario ${updatedVoluntario.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del Voluntario actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Voluntario no encontrado. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const voluntarios = await voluntarioService.getAll({
            include: [
                {
                    model: Institucion,
                    as: 'institucion',
                    attributes: ['nombre']
                }
            ],
        });
        res.status(200).json({ value: voluntarios });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_VOLUNTARIOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const voluntario = await voluntarioService.getById(id);
        if (!voluntario) {
            res.status(404).json({
                status: false,
                message: 'Voluntario no encontrado'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: voluntario
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};

export const getTotalRegistros = async (req: Request, res: Response) => {
    try {
        const total = await voluntarioService.countActive();
        res.status(200).json({ status: true, value: total });
    } catch (error) {
        handleHttp(res, `ERROR_COUNTING_RECORDS_${entidad}`, error);
    }
}

export const importJson = async (req: Request, res: Response) => {
    try {
        const voluntariosExcel = req.body;
        const result = await voluntarioService.importVoluntariosJson(voluntariosExcel);

        await registrarBitacora(req, 'CREACIÓN', 'Voluntarios', `Importación desde Excel`);

        res.status(201).json(result);
    } catch (error: any) {
        const msg = error.message;

        if (msg.includes('INVALID') || msg.includes('NOT_FOUND')) {
            res.status(400).json({
                status: false,
                message: msg.replace(/_/g, ' ')
            });
            return;
        }

        handleHttp(res, 'ERROR_POST_IMPORT', error);
    }
};