import { Request, Response } from 'express';
import { Clasificacion } from '../models/clasificacionModel';
import { handleHttp } from '../utils/handleError';
import { IClasificacion } from '../interfaces/IClasificacion';
import { registrarBitacora } from '../utils/bitacoraService';
import { Institucion } from '../models/institucionModel';

const entidad = 'CLASIFICACION';

const createidClasificacion = async (
    req: Request<{}, {}, Omit<IClasificacion,
        'idClasificacion' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const clasificacion: Omit<IClasificacion,
            'idClasificacion' | 'estado'> = req.body;
        const checkIs = await Clasificacion.findOne({ where: { nombre: clasificacion.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'La clasificacion ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó la clasificacion ${clasificacion.nombre}.`)
            const newClase = await Clasificacion.create(clasificacion);
            res.status(201).json({
                status: true,
                message: 'Clasificacion agregada exitosamente.',
                value: newClase
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getidClasificaciones = async (req: Request, res: Response) => {
    try {
        const clasificaciones = await Clasificacion.findAll({ where: { estado: true } });
        res.status(200).json({ value: clasificaciones });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getidClasificacionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const clasificacion = await Clasificacion.findByPk(id);
        if (!clasificacion) res.status(404).json({
            status: false,
            message: 'Clasificacion no encontrada'
        });
        else res.status(200).json({
            status: true,
            value: clasificacion
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateidClasificacion = async (req: Request & { user?: any }, res: Response) => {
    try {
        const clasificacion: IClasificacion = req.body;
        const checkIs = await Clasificacion.findByPk(clasificacion.idClasificacion);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Clasificacion no encontrada'
        });
        else {
            checkIs.nombre = clasificacion.nombre;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información de la clasificacion ${clasificacion.nombre}.`)
            res.status(200).json({
                status: true,
                message: 'Datos de clasificacion actualizados exitosamente',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteidClasificacion = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const clasificacion = await Clasificacion.findByPk(id);
        if (!clasificacion) {
            res.status(404).json({
                status: false,
                message: 'Clasificacion no encontrada. Imposible eliminar.'
            });
            return;
        }
        const institucion = await Institucion.findOne({
            where: { idClasificacion: clasificacion.idClasificacion }
        });
        if (institucion) {
            res.status(404).json({
                status: false,
                message: 'Existen instituciones asignadas a esta clase. Imposible eliminar.'
            });
            return;
        }
        clasificacion.estado = false; // Marcar como anulado
        await clasificacion.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó la Clasificacion ${clasificacion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Clasificacion eliminada correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createidClasificacion,
    getidClasificaciones,
    getidClasificacionById,
    updateidClasificacion,
    deleteidClasificacion
}