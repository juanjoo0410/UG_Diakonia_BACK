import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { IngresoDt } from '../models/ingresoDtModel';

const entidad = 'INGRESO_DT';

const getIngresosDt = async (req: Request, res: Response) => {
    try {
        const ingresosDt = await IngresoDt.findAll({ where: { estado: true } });
        res.status(200).json({ value: ingresosDt });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    getIngresosDt
}