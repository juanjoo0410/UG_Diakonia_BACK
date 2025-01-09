import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { IUbicacion } from '../interfaces/IUbicacion';
import { registrarBitacora } from '../utils/bitacoraService';
import { Ubicacion } from '../models/ubicacionModel';
import { Bodega } from '../models/bodegaModel';

const entidad = 'UBICACION';

const createUbicacion = async (
    req: Request<{}, {}, Omit<IUbicacion, 'idUbicacion' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const ubicacion: Omit<IUbicacion, 'idUbicacion' | 'estado'> = req.body;
        const checkIs = await Ubicacion.findOne({
            where: { codigo: ubicacion.codigo, }
        });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'La ubicación ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó la ubicación ${ubicacion.codigo}.`)
            const newUbicacion = await Ubicacion.create(ubicacion);
            res.status(201).json({
                status: true,
                message: 'Ubicación agregada exitosamente.',
                value: newUbicacion
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getUbicaciones = async (req: Request, res: Response) => {
    try {
        const ubicaciones = await Ubicacion.findAll({
            where: { estado: true },
            include: [{
                model: Bodega,
                as: 'bodega',
                attributes: ['nombre']
            }]
        });
        res.status(200).json({ value: ubicaciones });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getUbicacionesByIdBodega = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ubicacion = await Ubicacion.findAll({
            where: { idBodega: id },
            order: [['codigo', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: ubicacion
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_IDMENU', error);
    }
};

const getUbicacionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ubicacion = await Ubicacion.findByPk(id);
        if (!ubicacion) res.status(404).json({
            status: false,
            message: 'Ubicación no encontrada'
        });
        else res.status(200).json({
            status: true,
            value: ubicacion
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateUbicacion = async (req: Request & { user?: any }, res: Response) => {
    try {
        const ubicacion: IUbicacion = req.body;
        const checkIs = await Ubicacion.findByPk(ubicacion.idUbicacion);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Ubicación no encontrada'
            });
            return;
        }
        checkIs.idBodega = ubicacion.idBodega;
        checkIs.capacidadMaxima = ubicacion.capacidadMaxima;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información de la ubicacion ${ubicacion.codigo}.`)
        res.status(200).json({
            status: true,
            message: 'Datos de ubicacion actualizados exitosamente',
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteUbicacion = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const ubicacion = await Ubicacion.findByPk(id);
        if (!ubicacion) {
            res.status(404).json({
                status: false,
                message: 'Ubicación no encontrada'
            });
            return;
        }
        ubicacion.estado = false; // Marcar como anulado
        await ubicacion.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó la ubicación ${ubicacion.codigo}.`);
        res.status(200).json({
            status: true,
            message: 'Ubicación eliminada correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createUbicacion,
    getUbicaciones,
    getUbicacionesByIdBodega,
    getUbicacionById,
    updateUbicacion,
    deleteUbicacion
}