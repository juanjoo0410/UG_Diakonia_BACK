import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { IBeneficiario } from '../interfaces/IBeneficiario';
import { Beneficiario } from '../models/beneficiarioModel';
import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';

const entidad = 'BENEFICIARIO';

const create = async (
    req: Request<{}, {}, Omit<IBeneficiario, 'idBeneficiario' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const beneficiario: Omit<IBeneficiario, 'idBeneficiario' | 'estado'> = req.body;
        const checkIs = await Beneficiario.findOne({ where: { identificacion: beneficiario.identificacion } });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc del beneficiario ya existe'
            });
        } else {
            beneficiario.codigo = await generarCodigo('beneficiarios', transaction);
            const newBeneficiario = await Beneficiario.create(beneficiario);
            await transaction.commit();
            res.status(201).json({
                status: true,
                message: `Beneficiario con código ${newBeneficiario.codigo} agregado exitosamente.`,
                value: newBeneficiario
            });
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó el beneficiario ${beneficiario.nombre}.`);
        }
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const beneficiarios = await Beneficiario.findAll();
        res.status(200).json({ value: beneficiarios });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotal = async (req: Request, res: Response) => {
    try {
        const total = await Beneficiario.count({
            where: {
                estado: true,
            },
        });
        res.status(200).json({ status: true, value: total });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const beneficiario = await Beneficiario.findByPk(id);
        if (!beneficiario) res.status(404).json({
            status: false,
            message: 'Beneficiario no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: beneficiario
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const update = async (req: Request & { user?: any }, res: Response) => {
    try {
        const beneficiario: IBeneficiario = req.body;
        const checkIs = await Beneficiario.findByPk(beneficiario.idBeneficiario);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Beneficiario no encontrado'
        });
        else {
            checkIs.codigo = beneficiario.codigo;
            checkIs.esExtranjero = beneficiario.esExtranjero;
            checkIs.identificacion = beneficiario.identificacion;
            checkIs.nombre = beneficiario.nombre;
            checkIs.estadoCivil = beneficiario.estadoCivil;
            checkIs.sexo = beneficiario.sexo;
            checkIs.direccion = beneficiario.direccion;
            checkIs.telefono = beneficiario.telefono;
            checkIs.correo = beneficiario.correo;
            checkIs.esEmpleado = beneficiario.esEmpleado;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información del beneficiario ${beneficiario.nombre}.`)
            res.status(200).json({
                status: true,
                message: 'Datos de beneficiario actualizados exitosamente',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const updateStatus = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const beneficiario = await Beneficiario.findByPk(id);
        if (!beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado. Imposible cambiar de estado.'
            });
            return;
        }
        let status = true;
        if (beneficiario.estado) status = false;
        beneficiario.estado = status;
        await beneficiario.save();
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del beneficiario ${beneficiario.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del Beneficiario actualizado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    create,
    getAll,
    getTotal,
    getById,
    update,
    updateStatus
}