import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Kardex } from '../models/kardexModel';

const entidad = 'KARDEX';

const getKardex = async (req: Request, res: Response) => {
    try {
        const kardex = await Kardex.findAll();
        res.status(200).json({ value: kardex });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    getKardex
}