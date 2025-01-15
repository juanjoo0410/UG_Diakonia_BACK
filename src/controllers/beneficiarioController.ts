import { Request, Response } from 'express';
import { Beneficiario } from '../models/beneficiarioModel';
import { handleHttp } from '../utils/handleError';
import { IBeneficiario } from '../interfaces/IBeneficiario';
import { registrarBitacora } from '../utils/bitacoraService';
import { Op } from 'sequelize';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';

const entidad = 'BENEFICIARIO';

const createBeneficiario = async (
    req: Request<{}, {}, Omit<IBeneficiario, 'idBeneficiario' | 'estado'>> & { user?: any },
    res: Response) => {
        const transaction = await sequelize.transaction();
    try {
        const beneficiario: Omit<IBeneficiario, 'idBeneficiario' | 'estado'> = req.body;
        const checkIs = await Beneficiario.findOne({
            where: {
                [Op.or]: [
                    { identificacion: beneficiario.identificacion },
                    { nombre: { [Op.like]: `%${beneficiario.nombre}%` } },
                ],
            }
        });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc o el nombre del beneficiario ya existen en la base datos.'
            });
            return;
        } 
        beneficiario.codigo = await generarCodigo('beneficiarios', transaction);
        const newBeneficiario = await Beneficiario.create(beneficiario);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Beneficiario agregado exitosamente.',
            value: newBeneficiario
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el beneficiario ${beneficiario.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getBeneficiarios = async (req: Request, res: Response) => {
    try {
        const beneficiarios = await Beneficiario.findAll({ where: { estado: true } });
        res.status(200).json({ value: beneficiarios });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotalBeneficiarios = async (req: Request, res: Response) => {
    try {
        const totalBeneficiarios = await Beneficiario.count({
            where: {
                estado: true,
            },
        });
        res.status(200).json({ status: true, value: totalBeneficiarios });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotalBeneficiariosByInstituciones = async (req: Request, res: Response) => {
    try {
        const totalBeneficiarios = await Beneficiario.findAll({
            where: {
                estado: true,
            },
            attributes: [['nombre', 'name'], ['totalBeneficiarios', 'value']]
        });
        res.status(200).json({ status: true, value: totalBeneficiarios });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getBeneficiarioById = async (req: Request, res: Response) => {
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

const updateBeneficiario = async (req: Request & { user?: any }, res: Response) => {
    try {
        const beneficiario: IBeneficiario = req.body;
        const checkIs = await Beneficiario.findByPk(beneficiario.idBeneficiario);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado'
            });
            return;
        }
        if (beneficiario.nombre != checkIs.nombre) {
            const nameExist = await Beneficiario.findOne({ where: { nombre: beneficiario.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del Beneficiario ya existe'
                });
                return;
            }
        }
        checkIs.nombre = beneficiario.nombre;
        checkIs.tipoBeneficiario = beneficiario.tipoBeneficiario;
        checkIs.idTipoOrg = beneficiario.idTipoOrg;
        checkIs.idTipoPoblacion = beneficiario.idTipoPoblacion;
        checkIs.idClasificacion = beneficiario.idClasificacion;
        checkIs.actividad = beneficiario.actividad;
        checkIs.totalBeneficiarios = beneficiario.totalBeneficiarios;
        checkIs.direccion = beneficiario.direccion;
        checkIs.telefono = beneficiario.telefono;
        checkIs.correo = beneficiario.correo;
        checkIs.nombreContacto = beneficiario.nombreContacto;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del beneficiario ${beneficiario.nombre}.`)
        res.status(200).json({
            status: true,
            message: 'Datos de beneficiario actualizados exitosamente',
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteBeneficiario = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const beneficiario = await Beneficiario.findByPk(id);
        if (!beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado. Imposible eliminar.'
            });
            return;
        }
        beneficiario.estado = false; // Marcar como anulado
        await beneficiario.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el beneficiario ${beneficiario.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Beneficiario eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createBeneficiario,
    getBeneficiarios,
    getTotalBeneficiarios,
    getTotalBeneficiariosByInstituciones,
    getBeneficiarioById,
    updateBeneficiario,
    deleteBeneficiario
}