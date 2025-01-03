import { Request, Response } from 'express';
import { Establecimiento } from '../models/establecimientoModel';
import { handleHttp } from '../utils/handleError';
import { IEstablecimiento } from '../interfaces/IEstablecimiento';
import { registrarBitacora } from '../utils/bitacoraService';

const entidad = 'ESTABLECIMIENTO';

const createEstablecimiento = async (
    req: Request<{}, {}, Omit<IEstablecimiento, 'idEstablecimiento' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const establecimiento: Omit<IEstablecimiento, 'idEstablecimiento' | 'estado'> = req.body;
        const checkIs = await Establecimiento.findOne({
            where: { nombre: establecimiento.nombre, }
        });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El establecimiento ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó el establecimiento ${establecimiento.nombre}.`)
            const newEstablecimiento = await Establecimiento.create(establecimiento);
            res.status(201).json({
                status: true,
                message: 'Establecimiento agregado exitosamente.',
                data: newEstablecimiento
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getEstablecimientos = async (req: Request, res: Response) => {
    try {
        const establecimientos = await Establecimiento.findAll({ where: { estado: true } });
        res.status(200).json({ value: establecimientos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getEstablecimientoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const establecimiento = await Establecimiento.findByPk(id);
        if (!establecimiento) res.status(404).json({
            status: false,
            message: 'Establecimiento no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: establecimiento
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateEstablecimiento = async (req: Request & { user?: any }, res: Response) => {
    try {
        const establecimiento: IEstablecimiento = req.body;
        const checkIs = await Establecimiento.findByPk(establecimiento.idEstablecimiento);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Establecimiento no encontrado'
        });
        else {
            checkIs.codigo = establecimiento.codigo;
            checkIs.nombre = establecimiento.nombre;
            checkIs.idDonante = establecimiento.idDonante;
            checkIs.direccion = establecimiento.direccion;
            checkIs.telefono = establecimiento.telefono;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información del establecimiento ${establecimiento.nombre}.`)
            res.status(200).json({
                status: true,
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteEstablecimiento = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const establecimiento = await Establecimiento.findByPk(id);
        if (!establecimiento) res.status(404).json({
            status: false,
            message: 'Establecimiento no encontrado'
        });
        else {
            establecimiento.estado = false; // Marcar como anulado
            await establecimiento.save();
            await registrarBitacora(req, 'ELIMINACIÓN', entidad, `Se eliminó el establecimiento ${establecimiento.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Establecimiento eliminado correctamente'
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createEstablecimiento,
    getEstablecimientos,
    getEstablecimientoById,
    updateEstablecimiento,
    deleteEstablecimiento
}