import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { KardexTesoreriaService } from '../services/kardex-tesoreria.service';

const service = new KardexTesoreriaService();
const entidad = 'KARDEX_TESORERIA';

export const getAll = async (req: Request, res: Response) => {
    try {
        const kardex = await service.getAll();
        res.status(200).json({ value: kardex });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_KARDEX_TESORERIA', error);
    }
};