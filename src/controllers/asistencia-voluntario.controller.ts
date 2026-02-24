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

export const update = async (
    req: Request<{}, {}, IAsistenciaVoluntario> & { user?: any },
    res: Response
) => {
    const asistenciaData: IAsistenciaVoluntario = req.body;
    try {
        const updatedAsistencia = await asistenciaVoluntarioService.updateAsistenciaVoluntario(asistenciaData);
        res.status(200).json({
            status: true,
            message: 'Datos de asistencia actualizados exitosamente',
            value: updatedAsistencia
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la asistencia ${updatedAsistencia.idAsistenciaVoluntario}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Asistencia no encontrada.'
            });
            return;
        }

        return handleHttp(res, `ERROR_PUT_${entidad}`, error);
    }
};

export const deleteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await asistenciaVoluntarioService.delete(id, 'idAsistenciaVoluntario');

        if (result === 0) {
            res.status(404).json({
                status: false,
                message: "No se encontró el registro para eliminar."
            });
            return;
        }

        await registrarBitacora(req, 'ELIMINACIÓN', 'Asistencia', `Se eliminó la asistencia ID: ${id}`);

        res.status(200).json({
            status: true,
            message: "Registro eliminado permanentemente."
        });

    } catch (error: any) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(409).json({
                status: false,
                message: "No se puede eliminar: el registro está siendo usado en otras tablas."
            });
        }

        handleHttp(res, 'ERROR_DELETE_ASISTENCIA', error);
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

export const getUltimaFecha = async (req: Request, res: Response) => {
    try {
        const fecha = await asistenciaVoluntarioService.getUltimaFechaAsistencia();
        if (!fecha) {
            res.status(404).json({
                status: false,
                message: 'No se encontraron registros de asistencias'
            });
            return;
        }

        res.status(200).json({
            status: true,
            value: fecha
        });

    } catch (error) {
        handleHttp(res, `ERROR_GET_ULTIMA_FECHA_${entidad}`, error);
    }
};

export const getResumenHoras = async (req: Request, res: Response) => {
    const { semana, anio } = req.query;
    const semanaNum = parseInt(semana as string);
    const anioNum = parseInt(anio as string);
    try {
        if (isNaN(semanaNum) || isNaN(anioNum)) {
            res.status(400).json({
                status: false,
                message: "Semana y año inválidos."
            });
            return;
        }

        const data = await asistenciaVoluntarioService.getResumenHorasPorJornada(semanaNum, anioNum);
        res.status(200).json({
            status: true,
            value: data
        });

    } catch (error) {
        handleHttp(res, `ERROR_GET_RESUMEN_HRS_${entidad}`, error);
    }
};

export const getResumenVoluntarios = async (req: Request, res: Response) => {
    const { semana, anio } = req.query;
    const semanaNum = parseInt(semana as string);
    const anioNum = parseInt(anio as string);
    try {
        if (isNaN(semanaNum) || isNaN(anioNum)) {
            res.status(400).json({
                status: false,
                message: "Semana y año inválidos."
            });
            return;
        }

        const data = await asistenciaVoluntarioService.getResumenVoluntarios(semanaNum, anioNum);
        res.status(200).json({
            status: true,
            value: data
        });

    } catch (error) {
        handleHttp(res, `ERROR_GET_RESUMEN_VOL_${entidad}`, error);
    }
};

export const getResumenInstituciones = async (req: Request, res: Response) => {
    const { semana, anio } = req.query;
    const semanaNum = parseInt(semana as string);
    const anioNum = parseInt(anio as string);
    try {
        if (isNaN(semanaNum) || isNaN(anioNum)) {
            res.status(400).json({
                status: false,
                message: "Semana y año inválidos."
            });
            return;
        }

        const data = await asistenciaVoluntarioService.getResumenInstituciones(semanaNum, anioNum);
        res.status(200).json({
            status: true,
            value: data
        });

    } catch (error) {
        handleHttp(res, `ERROR_GET_RESUMEN_INST_${entidad}`, error);
    }
};

export const getResumenLugares = async (req: Request, res: Response) => {
    const { mes, anio } = req.query;
    const mesNum = parseInt(mes as string);
    const anioNum = parseInt(anio as string);
    try {
        if (isNaN(mesNum) || isNaN(anioNum)) {
            res.status(400).json({
                status: false,
                message: "mes y año inválidos."
            });
            return;
        }

        const data = await asistenciaVoluntarioService.getResumenLugares(mesNum, anioNum);
        res.status(200).json({
            status: true,
            value: data
        });

    } catch (error) {
        handleHttp(res, `ERROR_GET_RESUMEN_LUGARES_${entidad}`, error);
    }
};

export const importJson = async (req: Request, res: Response) => {
    try {
        const voluntariosExcel = req.body;
        const result = await asistenciaVoluntarioService.importAsistenciasJson(voluntariosExcel);

        await registrarBitacora(req, 'CREACIÓN', 'Asistencias', `Importación desde Excel`);

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