import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { AreaService } from '../services/area.service';
import { Area } from '../models/Area.model';
import { IArea } from '../interfaces/area.interface';
import { TipoJornadaService } from '../services/tipo-jornada.service';
import { ITipoJornada } from '../interfaces/tipo-jornada.interface';
import { TipoJornada } from '../models/TipoJornada.model';

const tipoJornadaService = new TipoJornadaService();
const entidad = 'TIPO_JORNADA';

export const create = async (
    req: Request<{}, {}, ITipoJornada> & { user?: any },
    res: Response
) => {
    const tipoJornadaData: ITipoJornada = req.body;
    try {
        const newTipoJornada: TipoJornada = await tipoJornadaService.createTipoJornada(tipoJornadaData);
        res.status(201).json({
            status: true,
            message: 'Tipo Jornada agregado exitosamente.',
            value: newTipoJornada
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el tipo jornada ${tipoJornadaData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Tipo Jornada ya existe.'
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
    req: Request<{}, {}, ITipoJornada> & { user?: any },
    res: Response
) => {
    const tipoJornadaData: ITipoJornada = req.body;
    try {
        const updatedTipoJornada = await tipoJornadaService.updateTipoJornada(tipoJornadaData);
        res.status(200).json({
            status: true,
            message: 'Datos de tipo jornada actualizados exitosamente',
            value: updatedTipoJornada
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información del tipo jornada ${updatedTipoJornada.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Tipo Jornada no encontrado.'
            });
            return;
        }

        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre del Tipo Jornada ya existe.'
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
        const updatedTipoJornada = await tipoJornadaService.updateTipoJornadaStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del tipo jornada ${updatedTipoJornada.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del Tipo Jornada actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Tipo Jornada no encontrado. Imposible cambiar de estado.'
            });
            return;
        }

        if (errorMessage === 'ASIGNADO_A_VOLUNTARIO') {
            res.status(404).json({
                status: false,
                message: 'Existen voluntarios asignados a este tipo de jornada. Imposible cambiar de estado.'
            });
            return;
        }

        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const tipoJornada = await tipoJornadaService.getAll();
        res.status(200).json({ value: tipoJornada });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_TIPOS_JORNADA', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipoJornada = await tipoJornadaService.getById(id);
        if (!tipoJornada) {
            res.status(404).json({
                status: false,
                message: 'Tipo Jornada no encontrado'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: tipoJornada
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};