import { Request, Response } from 'express';
import { Establecimiento } from '../models/establecimientoModel';
import { handleHttp } from '../utils/handleError';
import { IEstablecimiento } from '../interfaces/IEstablecimiento';
import { registrarBitacora } from '../utils/bitacoraService';
import { Donante } from '../models/donanteModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';

const entidad = 'ESTABLECIMIENTO';

const createEstablecimiento = async (
    req: Request<{}, {}, Omit<IEstablecimiento, 'idEstablecimiento' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const establecimiento: Omit<IEstablecimiento, 'idEstablecimiento' | 'estado'> = req.body;
        const checkIs = await Establecimiento.findOne({
            where: { nombre: establecimiento.nombre, }
        });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El establecimiento ya existe'
            });
            return;
        }
       
        establecimiento.codigo = await generarCodigo('establecimientos', transaction);
        const newEstablecimiento = await Establecimiento.create(establecimiento);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Establecimiento agregado exitosamente.',
            value: newEstablecimiento
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el establecimiento ${establecimiento.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getEstablecimientos = async (req: Request, res: Response) => {
    try {
        const establecimientos = await Establecimiento.findAll({
            include: [{
                model: Donante,
                as: 'donante',
                attributes: ['nombre']
            }]
        });
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
                message: 'Datos de establecimiento actualizados exitosamente',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const updateStatusEstablecimiento = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const establecimiento = await Establecimiento.findByPk(id);
        if (!establecimiento) res.status(404).json({
            status: false,
            message: 'Establecimiento no encontrado'
        });
        else {
            let status = true;
            if (establecimiento.estado) status = false;
            establecimiento.estado = status; // Marcar como anulado
            await establecimiento.save();
            await registrarBitacora(req, 'CAMBIO ESTADO', entidad, `Se cambió el estado del establecimiento ${establecimiento.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Estado de Establecimiento actualizado correctamente'
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
    updateStatusEstablecimiento as deleteEstablecimiento
}