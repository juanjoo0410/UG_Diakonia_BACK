import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { AutoidentificacionEtnicaService } from '../services/autoidentificacion-etnica.service';

const service = new AutoidentificacionEtnicaService();
const entidad = 'AUTOIDENTIFICACION_ETNICA';

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
                message: 'Autoidentificación étnica no encontrada/o'
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