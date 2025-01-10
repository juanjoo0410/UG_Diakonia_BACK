import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Stock } from '../models/stockModel';

const entidad = 'TIPO_ORGANIZACION';

const getStock = async (req: Request, res: Response) => {
    try {
        const stock = await Stock.findAll({ where: { estado: true } });
        res.status(200).json({ value: stock });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getStockProductoByUbicacion = async (req: Request, res: Response) => {
    try {
        const { idP, idU } = req.params;
        const stock = await Stock.findOne({
            where: {
                idProducto: idP,
                idUbicacion: idU
            }
        });
        res.status(200).json({ value: stock });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    getStock,
    getStockProductoByUbicacion
}