import { Request, Response } from 'express';
import { Bodega } from '../models/bodegaModel';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { IBodega } from '../interfaces/IBodega';
import { Op, Sequelize } from 'sequelize';
import { Ubicacion } from '../models/ubicacionModel';
import { Stock } from '../models/stockModel';

const entidad = 'BODEGA';

const createBodega = async (
    req: Request<{}, {}, Omit<IBodega, 'idBodega' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const bodega: Omit<IBodega, 'idBodega' | 'estado'> = req.body;
        const checkIs = await Bodega.findOne({
            where: {
                [Op.or]: [
                    { codigo: bodega.codigo },
                    { nombre: { [Op.like]: `%${bodega.nombre}%` } },
                ],
            }
        });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre o código de la bodega ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó tipo de la bodega ${bodega.nombre}.`)
            const newBodega = await Bodega.create(bodega);
            res.status(201).json({
                status: true,
                message: 'Bodega agregada exitosamente.',
                value: newBodega
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getBodegas = async (req: Request, res: Response) => {
    try {
        const bodegas = await Bodega.findAll();
        res.status(200).json({ value: bodegas });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getBodegasConStockPorProducto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bodegas = await Bodega.findAll({
            where: { estado: true },
            include: [
                {
                    model: Stock,
                    as: 'stocks',
                    attributes: [],
                    where: {
                        idProducto: id,
                        stock: { [Op.gt]: 0 } // Filtrar solo donde stock > 0
                    },
                }
            ],
            group: ['idBodega'], // Agrupar por los atributos de Bodega
        });

        res.status(200).json({ value: bodegas });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getBodegaById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const bodega = await Bodega.findByPk(id);
        if (!bodega) res.status(404).json({
            status: false,
            message: 'Bodega no encontrada'
        });
        else res.status(200).json({
            status: true,
            value: bodega
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateBodega = async (req: Request & { user?: any }, res: Response) => {
    try {
        const bodega: IBodega = req.body;
        const checkIs = await Bodega.findByPk(bodega.idBodega);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Bodega no encontrada'
        });
        else {
            checkIs.nombre = bodega.nombre;
            checkIs.tipoProducto = bodega.tipoProducto;
            checkIs.responsable = bodega.responsable;
            checkIs.venta = bodega.venta;
            checkIs.averiados = bodega.averiados;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información de la bodega ${bodega.nombre}.`)
            res.status(200).json({
                status: true,
                message: 'Datos de bodega actualizados exitosamente',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const updateStatusBodega = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const bodega = await Bodega.findByPk(id);
        if (!bodega) {
            res.status(404).json({
                status: false,
                message: 'Bodega no encontrada. Imposible cambiar de estado.'
            });
            return;
        }
        let status = true;
        if (bodega.estado){
            status = false;
            const stock = await Stock.findOne({
                where: {
                    idBodega: id,
                    stock: { [Op.gt]: 0 },
                }
            });
            if (stock) {
                res.status(404).json({
                    status: false,
                    message: 'La bodega dispone de stock. Imposible desactivar.'
                });
                return;
            }
            const ubicacion = await Ubicacion.findOne({ where: { estado: true, idBodega: bodega.idBodega } });
            if (ubicacion) {
                res.status(404).json({
                    status: false,
                    message: 'Existen ubicaciones asignadas a esta bodega. Imposible desactivar.'
                });
                return;
            }
        } 
        bodega.estado = status; // Marcar como anulado
        await bodega.save();
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado de la bodega ${bodega.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado de Bodega actualizado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createBodega,
    getBodegas,
    getBodegasConStockPorProducto,
    getBodegaById,
    updateBodega,
    updateStatusBodega as deleteBodega
}