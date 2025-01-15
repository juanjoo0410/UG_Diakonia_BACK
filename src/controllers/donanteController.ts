import { Request, Response } from 'express';
import { Donante } from '../models/donanteModel';
import { handleHttp } from '../utils/handleError';
import { IDonante } from '../interfaces/IDonante';
import { registrarBitacora } from '../utils/bitacoraService';
import { Establecimiento } from '../models/establecimientoModel';
import { Producto } from '../models/productoModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';

const entidad = 'DONANTE';

const createDonante = async (
    req: Request<{}, {}, Omit<IDonante, 'idDonante' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const donante: Omit<IDonante, 'idDonante' | 'estado'> = req.body;
        const checkIs = await Donante.findOne({ where: { identificacion: donante.identificacion } });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc del donante ya existe'
            });
            return;
        } 
        donante.codigo = await generarCodigo('donantes', transaction);
        const newdonante = await Donante.create(donante);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: `Donante con codigo ${newdonante.codigo} agregado exitosamente.`,
            value: newdonante
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el donante ${donante.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getDonantes = async (req: Request, res: Response) => {
    try {
        const donantes = await Donante.findAll({ where: { estado: true } });
        res.status(200).json({ value: donantes });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotalDonantes = async (req: Request, res: Response) => {
    try {
        const totalDonantes = await Donante.count({
            where: {
                estado: true,
            },
        });
        res.status(200).json({ status: true, value: totalDonantes });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getDonanteById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const donante = await Donante.findByPk(id);
        if (!donante) res.status(404).json({
            status: false,
            message: 'Donante no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: donante
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateDonante = async (req: Request & { user?: any }, res: Response) => {
    try {
        const donante: IDonante = req.body;
        const checkIs = await Donante.findByPk(donante.idDonante);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Donante no encontrado'
        });
        else {
            checkIs.codigo = donante.codigo;
            checkIs.identificacion = donante.identificacion;
            checkIs.nombre = donante.nombre;
            checkIs.tipoPersona = donante.tipoPersona;
            checkIs.direccion = donante.direccion;
            checkIs.telefono = donante.telefono;
            checkIs.correo = donante.correo;
            checkIs.nombreContacto = donante.nombreContacto;
            checkIs.abreviatura = donante.abreviatura;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información del donante ${donante.nombre}.`)
            res.status(200).json({
                status: true,
                message: 'Datos de donante actualizados exitosamente',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteDonante = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const donante = await Donante.findByPk(id);
        if (!donante) {
            res.status(404).json({
                status: false,
                message: 'Donante no encontrado. Imposible eliminar.'
            });
            return;
        };
        const establecimientos = await Establecimiento.findOne({ where: { idDonante: donante.idDonante } });
        if (establecimientos) {
            res.status(404).json({
                status: false,
                message: 'Existen establecimientos asignados a este donante. Imposible eliminar.'
            });
            return;
        };
        donante.estado = false; // Marcar como anulado
        await donante.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el donante ${donante.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Donante eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createDonante,
    getDonantes,
    getTotalDonantes,
    getDonanteById,
    updateDonante,
    deleteDonante
}