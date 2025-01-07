import { Request, Response } from 'express';
import { TipoOrg } from '../models/tipoOrgModel';
import { handleHttp } from '../utils/handleError';
import { ITipoOrg } from '../interfaces/ITipoOrg';
import { registrarBitacora } from '../utils/bitacoraService';
import { Beneficiario } from '../models/beneficiarioModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';

const entidad = 'TIPO_ORGANIZACION';

const createTipoOrg = async (
    req: Request<{}, {}, Omit<ITipoOrg, 'idTipoOrg' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const tipoOrg: Omit<ITipoOrg, 'idTipoOrg' | 'estado'> = req.body;
        const checkIs = await TipoOrg.findOne({
            where: { nombre: tipoOrg.nombre, }
        });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El tipo de organización ya existe'
            });
            return;
        }
        tipoOrg.codigo = await generarCodigo('tiposOrg', transaction);
        const newTipoOrg = await TipoOrg.create(tipoOrg);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Tipo de organización agregado exitosamente.',
            value: newTipoOrg
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el tipo de organización ${tipoOrg.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getTiposOrg = async (req: Request, res: Response) => {
    try {
        const tiposOrg = await TipoOrg.findAll({
            where: { estado: true }
        });
        res.status(200).json({ value: tiposOrg });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTipoOrgById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipoOrg = await TipoOrg.findByPk(id);
        if (!tipoOrg) res.status(404).json({
            status: false,
            message: 'Tipo de organización no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: tipoOrg
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateTipoOrg = async (req: Request & { user?: any }, res: Response) => {
    try {
        const tipoOrg: ITipoOrg = req.body;
        const checkIs = await TipoOrg.findByPk(tipoOrg.idTipoOrg);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Tipo de organización no encontrado'
            });
            return;
        }

        if (tipoOrg.nombre.toLocaleUpperCase() != 
        checkIs.nombre.toLocaleUpperCase()) {
            const nameExist = await TipoOrg.findOne({ where: { nombre: tipoOrg.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del Tipo de organización ya existe'
                });
                return;
            }
        }
        checkIs.codigo = tipoOrg.codigo;
        checkIs.nombre = tipoOrg.nombre;
        checkIs.descripcion = tipoOrg.descripcion;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del tipo de organización ${tipoOrg.nombre}.`)
        res.status(200).json({
            status: true,
            message: 'Datos de tipo de organizacion actualizados exitosamente',
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteTipoOrg = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const tipoOrg = await TipoOrg.findByPk(id);
        if (!tipoOrg) {
            res.status(404).json({
                status: false,
                message: 'Tipo de organización no encontrado'
            });
            return;
        }
        const beneficiario = await Beneficiario.findOne({ where: { idTipoOrg: tipoOrg.idTipoOrg } });
        if (beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Existen beneficiarios asignados a este tipo de organizacion. Imposible eliminar.'
            });
            return;
        }
        tipoOrg.estado = false; // Marcar como anulado
        await tipoOrg.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad, `Se eliminó el tipo de organización ${tipoOrg.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Tipo de organización eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createTipoOrg,
    getTiposOrg,
    getTipoOrgById,
    updateTipoOrg,
    deleteTipoOrg
}