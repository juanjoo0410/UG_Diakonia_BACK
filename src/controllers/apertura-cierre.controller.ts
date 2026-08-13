import { Request, Response } from 'express';
import { AperturaCierreService } from "../services/apertura-cierre.service";
import { IApertura } from '../interfaces/apertura.interface';
import { Apertura } from '../models/apertura.model';
import { registrarBitacora } from '../utils/bitacoraService';
import { handleHttp } from '../utils/handleError';
import { ICerrarCajaData } from '../interfaces/cerrar-caja-data.interface';
import { FilterDto } from '../dtos/filter.dto';

const service = new AperturaCierreService();
const entidad = 'APERTURA';

export const aperturar = async (
    req: Request<{}, {}, IApertura[]> & { user?: any },
    res: Response
) => {
    const data: IApertura[] = req.body;
    try {
        const usuarioId = req.user.idUsuario;
        const dataToCreate = data.map(apertura => ({
            ...apertura,
            creadorId: usuarioId
        }));

        const newAperturas: Apertura = await service.aperturarCajas(dataToCreate);
        res.status(201).json({
            status: true,
            message: 'Cajas aperturadas exitosamente.',
            value: newAperturas
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se aperturaron las cajas.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('cajas')) {
                res.status(400).json({
                    status: false,
                    message: error.message
                });
                return;
            }

            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const cerrar = async (
    req: Request<{}, {}, ICerrarCajaData> & { user?: any },
    res: Response
) => {
    const data: ICerrarCajaData = req.body;
    try {
        const usuarioId = req.user.idUsuario;
        const updatedApertura: Apertura = await service.cerrarCajas(data, usuarioId);
        res.status(201).json({
            status: true,
            message: 'Caja cerrada exitosamente.',
            value: updatedApertura
        });
        await registrarBitacora(req, 'ACTUALIZACIÓN', entidad, `Se cerró la caja.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('cajas')) {
                res.status(400).json({
                    status: false,
                    message: error.message
                });
                return;
            }

            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const getEstadoCajasByFecha = async (
    req: Request<{ fecha: string }>,
    res: Response
) => {
    const { fecha } = req.params;

    try {
        const estadoCajas = await service.getEstadoCajasByFecha(fecha);

        res.status(200).json({
            status: true,
            value: estadoCajas
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_ESTADO_CAJAS_${entidad}`, error);
    }
};

export const getByCajaIdAndFecha = async (
    req: Request<{ cajaId: string; fecha: string }>,
    res: Response
) => {
    const { cajaId, fecha } = req.params;

    try {
        const idCajaNumerico = parseInt(cajaId, 10);

        if (isNaN(idCajaNumerico)) {
            res.status(400).json({
                status: false,
                message: 'El identificador de la caja proporcionado no es válido.'
            });
            return;
        }
        const apertura = await service.getByCajaIdAndFecha(idCajaNumerico, fecha);
        if (!apertura) {
            res.status(404).json({
                status: false,
                message: `No se encontró ninguna apertura registrada para esta caja el día ${fecha}.`
            });
            return;
        }

        res.status(200).json({
            status: true,
            value: apertura
        });

    } catch (error) {
        return handleHttp(res, `ERROR_GET_BY_CAJA_Y_FECHA_${entidad}`, error);
    }
};

export const upsertByFecha = async (
    req: Request<{}, {}, { fecha: string; aperturaData: IApertura }> & { user?: any },
    res: Response
) => {
    const { fecha, aperturaData } = req.body;

    try {
        const response: Apertura = await service.upsertByFecha(fecha, aperturaData);

        res.status(200).json({
            status: true,
            message: 'Apertura procesada exitosamente (creada o actualizada).',
            value: response
        });

        await registrarBitacora(
            req,
            'PROCESAR',
            entidad,
            `Se procesó (creó/actualizó) la apertura de caja para el día ${fecha}.`
        );
    } catch (error) {
        if (error instanceof Error) {
            return handleHttp(res, `ERROR_UPSERT_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_UPSERT_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const getByFecha = async (
    req: Request<{ fecha: string }>,
    res: Response
) => {
    const { fecha } = req.params;

    try {
        const apertura = await service.getByFecha(fecha);

        if (!apertura) {
            res.status(404).json({
                status: false,
                message: `No se encontró ninguna apertura registrada para el día ${fecha}.`
            });
            return;
        }

        res.status(200).json({
            status: true,
            value: apertura
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_BY_FECHA_${entidad}`, error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const aperturas = await service.getAll();
        res.status(200).json({ value: aperturas });
    } catch (error) {
        handleHttp(res, `ERROR_GET_ALL_${entidad}`, error);
    }
};

export const getContribucionesCierreByDateAndCajaId = async (req: Request, res: Response) => {
    const { fecha, cajaId } = req.query;
    const fechaStr = fecha as string;
    const cajaIdNum = parseInt(cajaId as string);
    try {
        if (isNaN(cajaIdNum)) {
            res.status(400).json({
                status: false,
                message: "CajaID inválida."
            });
            return;
        }

        const data = await service.getContribucionesCierreByDateAndCajaIdAsync(fechaStr, cajaIdNum);
        res.status(200).json({
            status: true,
            value: data
        });

    } catch (error) {
        handleHttp(res, `ERROR_GET_RESUMEN_INST_${entidad}`, error);
    }
};

export const getEgresosCierreByDateAndCajaId = async (req: Request, res: Response) => {
    const { fecha, cajaId } = req.query;
    const fechaStr = fecha as string;
    const cajaIdNum = parseInt(cajaId as string);
    try {
        if (isNaN(cajaIdNum)) {
            res.status(400).json({
                status: false,
                message: "CajaID inválida."
            });
            return;
        }

        const data = await service.getEgresosCierreByDateAndCajaIdAsync(fechaStr, cajaIdNum);
        res.status(200).json({
            status: true,
            value: data
        });

    } catch (error) {
        handleHttp(res, `ERROR_GET_RESUMEN_INST_${entidad}`, error);
    }
};

export const getAperturaCierreByDateAndCajaId = async (
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
        const kardex = await service.getAperturaCierreByDateAndCajaIdAsync(filters);

        res.status(200).json({
            status: true,
            value: kardex
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_${entidad}`, error);
    }
};