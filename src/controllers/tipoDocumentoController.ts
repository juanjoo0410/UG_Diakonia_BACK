import { Request, Response } from 'express';
import { TipoPoblacion } from '../models/tipoPoblacionModel';
import { handleHttp } from '../utils/handleError';
import { ITipoPoblacion } from '../interfaces/ITipoPoblacion';
import { registrarBitacora } from '../utils/bitacoraService';
import { Beneficiario } from '../models/beneficiarioModel';
import { ITipoDocumento } from '../interfaces/ITipoDocumento';
import { TipoDocumento } from '../models/tipoDocumentoModel';

const entidad = 'TIPO_DOCUMENTO';

const createTipoDocumento = async (
    req: Request<{}, {}, Omit<ITipoDocumento, 'idTipoDocumento' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const tipoDocumento: Omit<ITipoDocumento, 'idTipoDocumento' | 'estado'> = req.body;
        const checkIs = await TipoDocumento.findOne({ where: { nombre: tipoDocumento.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre del tipo de documento ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó tipo de documento ${tipoDocumento.nombre}.`)
            const newTipoPoblacion = await TipoDocumento.create(tipoDocumento);
            res.status(201).json({
                status: true,
                message: 'Tipo de documento agregado exitosamente.',
                data: newTipoPoblacion
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getTiposDocumento = async (req: Request, res: Response) => {
    try {
        const tipoDocumento = await TipoDocumento.findAll({ where: { estado: true } });
        res.status(200).json({ value: tipoDocumento });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTipoDocumentoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipoDocumento = await TipoDocumento.findByPk(id);
        if (!tipoDocumento) res.status(404).json({
            status: false,
            message: 'Tipo de documento no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: tipoDocumento
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateTipoDocumento = async (req: Request & { user?: any }, res: Response) => {
    try {
        const tipoDocumento: ITipoDocumento = req.body;
        const checkIs = await TipoDocumento.findByPk(tipoDocumento.idTipoDocumento);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Tipo de documento no encontrado'
            });
            return;
        };
        if (tipoDocumento.nombre != checkIs.nombre) {
            const nameExist = await TipoDocumento.findOne({ where: { nombre: tipoDocumento.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nombre del Tipo de documento ya existe'
                });
                return;
            }
        };
        checkIs.nombre = tipoDocumento.nombre;
        checkIs.ingreso = tipoDocumento.ingreso;
        checkIs.egreso = tipoDocumento.egreso;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del tipo de documento ${tipoDocumento.nombre}.`)
        res.status(200).json({
            status: true,
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteTipoDocumento = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const tipoDocumento = await TipoDocumento.findByPk(id);
        if (!tipoDocumento) {
            res.status(404).json({
                status: false,
                message: 'Tipo de documento no encontrado. Imposible eliminar.'
            });
            return;
        }
        tipoDocumento.estado = false; // Marcar como anulado
        await tipoDocumento.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el tipo de documento ${tipoDocumento.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Tipo de documento eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createTipoDocumento,
    getTiposDocumento,
    getTipoDocumentoById,
    updateTipoDocumento,
    deleteTipoDocumento
}