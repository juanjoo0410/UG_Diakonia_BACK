import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { ReservaService } from '../services/reserva.service';

const service = new ReservaService();
const entidad = 'RESERVA';

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await service.getAll();
        res.status(200).json({ value: response });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_RESERVAS', error);
    }
};