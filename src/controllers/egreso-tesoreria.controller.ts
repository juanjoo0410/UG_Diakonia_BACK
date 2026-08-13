import { Request, Response } from 'express';
import { registrarBitacora } from "../utils/bitacoraService";
import { handleHttp } from '../utils/handleError';
import { EgresoTesoreriaService } from '../services/egreso-tesoreria.service';
import { IEgresoTesoreria } from '../interfaces/egreso-tesoreria.interface';
import { EgresoTesoreria } from '../models/egreso-tesoreria.model';
import { FilterDto } from '../dtos/filter.dto';

const service = new EgresoTesoreriaService();
const entidad = 'EGRESO_TESORERIA';

export const create = async (
    req: Request<{}, {}, IEgresoTesoreria> & { user?: any },
    res: Response
) => {
    const data: IEgresoTesoreria = req.body;
    try {
        const usuarioId = req.user.idUsuario;
        data.creadorId = usuarioId;

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
    const idNum = parseInt(id as string);
    try {
        if (isNaN(idNum)) {
            res.status(400).json({
                status: false,
                message: "EgresoId inválido."
            });
            return;
        }

        const egreso = await service.getEgresoById(idNum);
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

export const getValesCajaByDate = async (
    req: Request<{}, {}, FilterDto>,
    res: Response
) => {
    const filters: FilterDto = req.body;

    if (!filters.fechaInicio || !filters.fechaFin) {
        res.status(400).json({
            status: false,
            message: 'Se requieren fecha inicio y fecha fin para la consulta.'
        });
        return;
    }

    try {
        const result = await service.getValesCajaByDateAsync(filters);

        res.status(200).json({
            status: true,
            value: result
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_${entidad}`, error);
    }
};

export const annular = async (
    req: Request<{ id: string }, {}, {}, {}> & { user?: any },
    res: Response) => {
    const { id } = req.params;
    const idNum = parseInt(id as string);
    try {
        const usuarioId = req.user.idUsuario;

        if (isNaN(idNum)) {
            res.status(400).json({
                status: false,
                message: "EgresoId inválido."
            });
            return;
        }

        const egreso = await service.annularEgresoById(idNum, usuarioId);
        if (!egreso) {
            res.status(404).json({
                status: false,
                message: 'Egreso no encontrada/o'
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Egreso anulado exitosamente'
        });

        await registrarBitacora(req, 'ANULACIÓN', entidad, `Se anuló el egreso No. ${idNum}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'EGRESO_NO_ENCONTRADO') {
                res.status(400).json({
                    status: false,
                    message: 'Egreso no encontrado.'
                });
                return;
            }

            if (error.message === 'EGRESO_ANULADO') {
                res.status(400).json({
                    status: false,
                    message: 'El egreso ya fue anulado.'
                });
                return;
            }

            if (error.message === 'CAJA_NO_ENCONTRADA') {
                res.status(400).json({
                    status: false,
                    message: 'Caja no encontrada.'
                });
                return;
            }

            return handleHttp(res, `ERROR_ANNULAR_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_ANNULAR_${entidad}_UNKNOWN`, String(error));
        }
    }
};