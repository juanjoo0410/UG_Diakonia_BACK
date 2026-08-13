import { Request, Response } from 'express';
import { registrarBitacora } from "../utils/bitacoraService";
import { handleHttp } from '../utils/handleError';
import { IngresoTesoreriaService } from '../services/ingreso-tesoreria.service';
import { IIngresoTesoreria } from '../interfaces/ingreso-tesoreria.interface';
import { IngresoTesoreria } from '../models/ingreso-tesoreria.model';

const service = new IngresoTesoreriaService();
const entidad = 'INGRESO_TESORERIA';

export const create = async (
    req: Request<{}, {}, IIngresoTesoreria> & { user?: any },
    res: Response
) => {
    const data: IIngresoTesoreria = req.body;
    try {
        const usuarioId = req.user.idUsuario;
        data.creadorId = usuarioId;

        const newIngreso: IngresoTesoreria = await service.createIngreso(data);
        res.status(201).json({
            status: true,
            message: 'Ingreso creado exitosamente.',
            value: newIngreso
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el Ingreso de tesorería ${data.id}.`);
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
        const ingresos = await service.getAll();
        res.status(200).json({
            status: true,
            value: ingresos
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_INGRESOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ingreso = await service.getById(id);
        if (!ingreso) {
            res.status(404).json({
                status: false,
                message: 'Ingreso no encontrada/o'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: ingreso
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};