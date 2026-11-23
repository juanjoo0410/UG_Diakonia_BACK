import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { Institucion } from '../models/institucionModel';
import { BeneficiarioProyectoService } from '../services/beneficiario-proyecto.service';
import { IBeneficiarioProyecto } from '../interfaces/beneficiario-proyecto.interface';
import { BeneficiarioProyecto } from '../models/beneficiario-proyecto.model';

const service = new BeneficiarioProyectoService();
const entidad = 'BENEFICIARIO_PROYECTO';

export const create = async (
    req: Request<{}, {}, IBeneficiarioProyecto> & { user?: any },
    res: Response
) => {
    const data: IBeneficiarioProyecto = req.body;
    try {
        const newEntity: BeneficiarioProyecto = await service.createBeneficiarioProyecto(data);
        res.status(201).json({
            status: true,
            message: 'Beneficiario agregado exitosamente.',
            value: newEntity
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el beneficiario de proyecto ${data.nombres} ${data.apellidos}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Beneficiario ya existe.'
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
    req: Request<{}, {}, IBeneficiarioProyecto> & { user?: any },
    res: Response
) => {
    const data: IBeneficiarioProyecto = req.body;
    try {
        const updatedEntity = await service.updateBeneficiarioProyecto(data);
        res.status(200).json({
            status: true,
            message: 'Datos de beneficiario actualizados exitosamente',
            value: updatedEntity
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información del beneficiario de proyecto ${updatedEntity.nombres} ${updatedEntity.apellidos}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado.'
            });
            return;
        }

        if (errorMessage === 'COINCIDENCIA_ENTIDAD') {
            res.status(400).json({
                status: false,
                message: 'La identificación del beneficiario ya existe.'
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
        const updatedEntity = await service.updateBeneficiarioProyectoStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del beneficiario ${updatedEntity.nombres} ${updatedEntity.apellidos}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del beneficiario actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await service.getAll();
        res.status(200).json({ value: response });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_VOLUNTARIOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const response = await service.getById(id);
        if (!response) {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: response
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};

export const getTotalRegistros = async (req: Request, res: Response) => {
    try {
        const total = await service.countActive();
        res.status(200).json({ status: true, value: total });
    } catch (error) {
        handleHttp(res, `ERROR_COUNTING_RECORDS_${entidad}`, error);
    }
}