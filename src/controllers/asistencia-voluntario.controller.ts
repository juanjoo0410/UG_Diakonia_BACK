import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { AsistenciaVoluntarioService } from '../services/asistencia-voluntario.service';
import { IAsistenciaVoluntario } from '../interfaces/asistencia-voluntario.interface';
import { AsistenciaVoluntario } from '../models/AsistenciaVoluntario.model';
import { FilterDto } from '../dtos/filter.dto';

const asistenciaVoluntarioService = new AsistenciaVoluntarioService();
const entidad = 'ASISTENCIA_VOLUNTARIO';

export const create = async (
    req: Request<{}, {}, IAsistenciaVoluntario> & { user?: any },
    res: Response
) => {
    const asistenciaVoluntarioData: IAsistenciaVoluntario = req.body;
    try {
        const newAsistenciaVoluntario: AsistenciaVoluntario = await asistenciaVoluntarioService.createAsistenciaVoluntario(asistenciaVoluntarioData);
        res.status(201).json({
            status: true,
            message: 'Asistencia Voluntario agregada exitosamente.',
            value: newAsistenciaVoluntario
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó la asistencia del voluntario ${asistenciaVoluntarioData.voluntario?.nombre ?? ''}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ASISTENCIA_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'El voluntario ya fue registrado con anterioridad en la fecha establecida.'
                });
                return;
            }
            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const getAllByDate = async (
    req: Request<{}, {}, FilterDto>, 
    res: Response
) => {
    const filters: FilterDto = req.body;

    if (!filters.fechaInicio || !filters.fechaFin) {
        res.status(400).json({
            status: false,
            message: 'Se requieren fechaInicio y fechaFin para la consulta.'
        });
        return;
    }

    try {
        const comprobanteVenta = await asistenciaVoluntarioService.getAllAsistenciasByDate(filters);
        res.status(200).json({ status: true, value: comprobanteVenta });

    } catch (error) {
        return handleHttp(res, 'ERROR_GET_ALL_ASISTENCIAS_BY_DATE', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const asistencias = await asistenciaVoluntarioService.getAll();
        res.status(200).json({ value: asistencias });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_ASISTENCIAS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const asistencia = await asistenciaVoluntarioService.getById(id);
        if (!asistencia) {
            res.status(404).json({
                status: false,
                message: 'Asistencia no encontrada'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: asistencia
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};