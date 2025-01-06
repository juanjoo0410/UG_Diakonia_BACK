import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { ITipoTransaccion } from '../interfaces/ITipoTransaccion';
import { TipoTransaccion } from '../models/tipoTransaccionModel';

const entidad = 'TIPO_TRANSACCION';

const createTipoTransaccion = async (
    req: Request<{}, {}, Omit<ITipoTransaccion, 'idTipoTransaccion' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const tipoTransaccion: Omit<ITipoTransaccion, 'idTipoTransaccion' | 'estado'> = req.body;
        const checkIs = await TipoTransaccion.findOne({ where: { nombre: tipoTransaccion.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre del tipo de transaccion ya existe'
            });
        } else {
            const newTipoTransaccion = await TipoTransaccion.create(tipoTransaccion);
            res.status(201).json({
                status: true,
                message: 'Tipo de transaccion agregado exitosamente.',
                data: newTipoTransaccion
            });
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó tipo de transaccion ${tipoTransaccion.nombre}.`);
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getTiposTransaccion = async (req: Request, res: Response) => {
    try {
        const tiposTransaccion = await TipoTransaccion.findAll({ where: { estado: true } });
        res.status(200).json({ value: tiposTransaccion });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTipoTransaccionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipoTransaccion = await TipoTransaccion.findByPk(id);
        if (!tipoTransaccion) res.status(404).json({
            status: false,
            message: 'Tipo de transaccion no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: tipoTransaccion
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateTipoTransaccion = async (req: Request & { user?: any }, res: Response) => {
    try {
        const tipoTransaccion: ITipoTransaccion = req.body;
        const checkIs = await TipoTransaccion.findByPk(tipoTransaccion.idTipoTransaccion);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Tipo de transaccion no encontrado'
            });
            return;
        };
        if (tipoTransaccion.nombre != checkIs.nombre) {
            const nameExist = await TipoTransaccion.findOne({ where: { nombre: tipoTransaccion.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nombre del Tipo de transaccion ya existe'
                });
                return;
            }
        };
        checkIs.nombre = tipoTransaccion.nombre;
        checkIs.ingreso = tipoTransaccion.ingreso;
        checkIs.egreso = tipoTransaccion.egreso;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del tipo de transaccion ${tipoTransaccion.nombre}.`)
        res.status(200).json({
            status: true,
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteTipoTransaccion = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const tipoTransaccion = await TipoTransaccion.findByPk(id);
        if (!tipoTransaccion) {
            res.status(404).json({
                status: false,
                message: 'Tipo de transaccion no encontrado. Imposible eliminar.'
            });
            return;
        }
        tipoTransaccion.estado = false; // Marcar como anulado
        await tipoTransaccion.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el tipo de transaccion ${tipoTransaccion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Tipo de transaccion eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createTipoTransaccion,
    getTiposTransaccion,
    getTipoTransaccionById,
    updateTipoTransaccion,
    deleteTipoTransaccion
}