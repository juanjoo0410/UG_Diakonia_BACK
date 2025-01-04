import { Request, Response } from 'express';
import { Bodega } from '../models/bodegaModel';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { IBodega } from '../interfaces/IBodega';
import { Op } from 'sequelize';
import { Ubicacion } from '../models/ubicacionModel';

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
                data: newBodega
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getBodegas = async (req: Request, res: Response) => {
    try {
        const bodegas = await Bodega.findAll({ where: { estado: true } });
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
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteBodega = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const bodega = await Bodega.findByPk(id);
        if (!bodega) {
            res.status(404).json({
                status: false,
                message: 'Bodega no encontrada. Imposible eliminar.'
            });
            return;
        }
        const ubicacion = await Ubicacion.findOne({ where: { idBodega: bodega.idBodega } });
        if (ubicacion) {
            res.status(404).json({
                status: false,
                message: 'Existen ubicaciones asignadas a esta bodega. Imposible eliminar.'
            });
            return;
        }
        bodega.estado = false; // Marcar como anulado
        await bodega.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó la bodega ${bodega.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Bodega eliminada correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createBodega,
    getBodegas,
    getBodegaById,
    updateBodega,
    deleteBodega
}