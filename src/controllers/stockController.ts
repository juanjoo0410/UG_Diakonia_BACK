import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Stock } from '../models/stockModel';
import { Producto } from '../models/productoModel';
import { Bodega } from '../models/bodegaModel';
import { Ubicacion } from '../models/ubicacionModel';
import { Sequelize } from 'sequelize';

const entidad = 'STOCK';

const getStock = async (req: Request, res: Response) => {
    try {
        const stock = await Stock.findAll({
            where: { estado: true },
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['codigo', 'descripcion', 'sku', 'lote', 'fechaCaducidad']
            }, {
                model: Bodega,
                as: 'bodega',
                attributes: ['nombre'],
                where: { venta: false }
            }, {
                model: Ubicacion,
                as: 'ubicacion',
                attributes: ['codigo', 'capacidadMaxima']
            }],
            order: [
                [Sequelize.literal(`CASE WHEN producto.fechaCaducidad IS NULL THEN 1 ELSE 0 END`), 'ASC'],
                [Sequelize.col('producto.fechaCaducidad'), 'ASC']
            ],
        });
        res.status(200).json({ status: true, value: stock });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getStockVentas = async (req: Request, res: Response) => {
    try {
        const stock = await Stock.findAll({
            where: { estado: true },
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['codigo', 'descripcion', 'sku', 'lote', 'fechaCaducidad']
            }, {
                model: Bodega,
                as: 'bodega',
                attributes: ['nombre'],
                where: { venta: true }
            }, {
                model: Ubicacion,
                as: 'ubicacion',
                attributes: ['codigo', 'capacidadMaxima']
            }],
            order: [
                [Sequelize.literal(`CASE WHEN producto.fechaCaducidad IS NULL THEN 1 ELSE 0 END`), 'ASC'],
                [Sequelize.col('producto.fechaCaducidad'), 'ASC']
            ],
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
    getStockVentas,
    getStockProductoByUbicacion
}