import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Stock } from '../models/stockModel';
import { Producto } from '../models/productoModel';
import { Bodega } from '../models/bodegaModel';
import { Ubicacion } from '../models/ubicacionModel';

const entidad = 'TIPO_ORGANIZACION';

const getStock = async (req: Request, res: Response) => {
    try {
        const stock = await Stock.findAll({
            where: { estado: true },
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['codigo', 'descripcion', 'sku']
            }, {
                model: Bodega,
                as: 'bodega',
                attributes: ['nombre']
            }, {
                model: Ubicacion,
                as: 'ubicacion',
                attributes: ['codigo', 'capacidadMaxima']
            }]
        });
        res.status(200).json({ status: true, value: stock });
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
        res.status(200).json({ status: true, value: stock });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    getStock,
    getStockProductoByUbicacion
}