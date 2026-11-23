import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { EstadoCivilService } from '../services/estado-civil.service';

const service = new EstadoCivilService();
const entidad = 'ESTADO_CIVIL';

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await service.getAll();
        res.status(200).json({ value: response });
    } catch (error) {
        handleHttp(res, `ERROR_GET_ALL_${entidad}`, error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const response = await service.getById(id);
        if (!response) {
            res.status(404).json({
                status: false,
                message: 'Estado civil no encontrada/o'
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