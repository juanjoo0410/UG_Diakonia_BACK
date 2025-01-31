import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import sequelize from '../config/db';
import { IParametro } from '../interfaces/IParametro';
import { Parametro } from '../models/parametroModel';

const entidad = 'PARAMETRO';

const createParametro = async (
    req: Request<{}, {}, Omit<IParametro, 'idParametro' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const parametro: Omit<IParametro, 'idParametro' | 'estado'> = req.body;
        const checkIs = await Parametro.findOne({ where: { codigo: parametro.codigo } });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El código del parámetro ya existe en la base datos.'
            });
            return;
        }
        const newParametro = await Parametro.create(parametro, { transaction });
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: `Parámetro con código ${newParametro.codigo} agregado exitosamente.`,
            value: newParametro
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el parámetro ${parametro.codigo}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getParametros = async (req: Request, res: Response) => {
    try {
        const parametros = await Parametro.findAll({ where: { estado: true } });
        res.status(200).json({ status: true, value: parametros });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getParametroByCodigo = async (req: Request, res: Response) => {
    const { codigo } = req.params;
    try {
        const parametro = await Parametro.findOne({ where: { codigo } });
        if (!parametro) {
            res.status(404).json({ status: false, message: 'Parámetro no encontrado' });
            return;
        }
        res.status(200).json({ status: true, value: parametro });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_CODIGO', error);
    }
};

const getParametroById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const parametro = await Parametro.findByPk(id);
        if (!parametro) res.status(404).json({
            status: false,
            message: 'Parámetro no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: parametro
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateParametro = async (req: Request & { user?: any }, res: Response) => {
    try {
        const parametro: IParametro = req.body;
        const checkIs = await Parametro.findByPk(parametro.idParametro);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Parámetro no encontrado'
            });
            return;
        }
        if (parametro.codigo != checkIs.codigo) {
            const nameExist = await Parametro.findOne({ where: { codigo: parametro.codigo } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El código del parámetro ya existe'
                });
                return;
            }
        }
        checkIs.codigo = parametro.codigo;
        checkIs.descripcion = parametro.descripcion;
        checkIs.valor = parametro.valor;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del parámetro ${parametro.codigo}.`)
        res.status(200).json({
            status: true,
            message: 'Datos del parámetro actualizados exitosamente',
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteParametro = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const parametro = await Parametro.findByPk(id);
        if (!parametro) {
            res.status(404).json({
                status: false,
                message: 'Parámetro no encontrado. Imposible eliminar.'
            });
            return;
        }
        parametro.estado = false; // Marcar como anulado
        await parametro.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el parámetro ${parametro.codigo}.`);
        res.status(200).json({
            status: true,
            message: 'Parámetro eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createParametro,
    getParametros,
    getParametroById,
    getParametroByCodigo,
    updateParametro,
    deleteParametro
}