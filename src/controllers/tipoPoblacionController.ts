import { Request, Response } from 'express';
import { TipoPoblacion } from '../models/tipoPoblacionModel';
import { handleHttp } from '../utils/handleError';
import { ITipoPoblacion } from '../interfaces/ITipoPoblacion';
import { registrarBitacora } from '../utils/bitacoraService';
import { Beneficiario } from '../models/beneficiarioModel';

const entidad = 'TIPO_POBLACIÓN';

const createTipoPoblacion = async (
    req: Request<{}, {}, Omit<ITipoPoblacion, 'idTipoPoblacion' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const tipoPoblacion: Omit<ITipoPoblacion, 'idTipoPoblacion' | 'estado'> = req.body;
        const checkIs = await TipoPoblacion.findOne({ where: { nombre: tipoPoblacion.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre del tipo de poblacion ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó tipo de población ${tipoPoblacion.nombre}.`)
            const newTipoPoblacion = await TipoPoblacion.create(tipoPoblacion);
            res.status(201).json({
                status: true,
                message: 'Tipo de poblacion agregado exitosamente.',
                data: newTipoPoblacion
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getTiposPoblacion = async (req: Request, res: Response) => {
    try {
        const tipoPoblacion = await TipoPoblacion.findAll({ where: { estado: true } });
        res.status(200).json({ value: tipoPoblacion });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTipoPoblacionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipoPoblacion = await TipoPoblacion.findByPk(id);
        if (!tipoPoblacion) res.status(404).json({
            status: false,
            message: 'Tipo de población no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: tipoPoblacion
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateTipoPoblacion = async (req: Request & { user?: any }, res: Response) => {
    try {
        const tipoPoblacion: ITipoPoblacion = req.body;
        const checkIs = await TipoPoblacion.findByPk(tipoPoblacion.idTipoPoblacion);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Tipo de población no encontrado'
        });
        else {
            checkIs.nombre = tipoPoblacion.nombre;
            checkIs.descripcion = tipoPoblacion.descripcion;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información del tipo de población ${tipoPoblacion.nombre}.`)
            res.status(200).json({
                status: true,
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteTipoPoblacion = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const tipoPoblacion = await TipoPoblacion.findByPk(id);
        if (!tipoPoblacion) {
            res.status(404).json({
                status: false,
                message: 'Tipo de población no encontrado. Imposible eliminar.'
            });
            return;
        }
        const beneficiario = await Beneficiario.findOne({ where: { idTipoPoblacion: tipoPoblacion.idTipoPoblacion } });
        if (beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Existen beneficiarios asignados a este tipo de población. Imposible eliminar.'
            });
            return;
        }
        tipoPoblacion.estado = false; // Marcar como anulado
        await tipoPoblacion.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el tipo de poblacion ${tipoPoblacion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Tipo de población eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createTipoPoblacion,
    getTiposPoblacion,
    getTipoPoblacionById,
    updateTipoPoblacion,
    deleteTipoPoblacion
}