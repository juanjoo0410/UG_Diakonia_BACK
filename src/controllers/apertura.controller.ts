import { Request, Response } from 'express';
import { AperturaService } from "../services/apertura.service";
import { IApertura } from '../interfaces/apertura.interface';
import { Apertura } from '../models/apertura.model';
import { registrarBitacora } from '../utils/bitacoraService';
import { handleHttp } from '../utils/handleError';

const service = new AperturaService();
const entidad = 'APERTURA';

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