import { Request, Response } from 'express';
import { registrarBitacora } from "../utils/bitacoraService";
import { handleHttp } from '../utils/handleError';
import { EgresoTesoreriaService } from '../services/egreso-tesoreria.service';
import { IEgresoTesoreria } from '../interfaces/egreso-tesoreria.interface';
import { EgresoTesoreria } from '../models/egreso-tesoreria.model';

const service = new EgresoTesoreriaService();
const entidad = 'EGRESO_TESORERIA';

export const create = async (
    req: Request<{}, {}, IEgresoTesoreria> & { user?: any },
    res: Response
) => {
    const data: IEgresoTesoreria = req.body;
    try {
        const newEgreso: EgresoTesoreria = await service.createEgreso(data);
        res.status(201).json({
            status: true,
            message: 'Egreso creado exitosamente.',
            value: newEgreso
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el egreso de tesorería ${data.id}.`);
    } catch (error) {
        if (error instanceof Error) {
            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const egresos = await service.getAll();
        res.status(200).json({ value: egresos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_EGRESOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const egreso = await service.getById(id);
        if (!egreso) {
            res.status(404).json({
                status: false,
                message: 'Egreso no encontrada/o'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: egreso
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};