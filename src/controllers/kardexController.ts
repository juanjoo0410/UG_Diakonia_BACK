import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Kardex } from '../models/kardexModel';
import { Op } from 'sequelize';
import { Bodega } from '../models/bodegaModel';
import { Producto } from '../models/productoModel';

const entidad = 'KARDEX';

const getKardex = async (req: Request, res: Response) => {
    const { fechaInicio, fechaFin } = req.body;
    try {
        const kardex = await Kardex.findAll({
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                model: Bodega,
                as: 'bodega',
                attributes: ['codigo', 'nombre']
            }, {
                model: Producto,
                as: 'producto',
                attributes: ['descripcion', 'prest', 'sku']
            }]
        });
        res.status(200).json({ status: true, value: kardex });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    getKardex
}