import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { ICliente } from '../interfaces/ICliente';
import { Cliente } from '../models/clienteModel';
import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';

const entidad = 'CLIENTE';

const createCliente = async (
    req: Request<{}, {}, Omit<ICliente, 'idCliente' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const cliente: Omit<ICliente, 'idCliente' | 'estado'> = req.body;
        const checkIs = await Cliente.findOne({ where: { identificacion: cliente.identificacion } });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc del cliente ya existe'
            });
        } else {
            cliente.codigo = await generarCodigo('clientes', transaction);
            const newCliente = await Cliente.create(cliente);
            await transaction.commit();
            res.status(201).json({
                status: true,
                message: `Cliente con codigo ${newCliente.codigo} agregado exitosamente.`,
                value: newCliente
            });
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó el cliente ${cliente.nombre}.`);
        }
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await Cliente.findAll({ where: { estado: true } });
        res.status(200).json({ value: clientes });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getClienteById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) res.status(404).json({
            status: false,
            message: 'Cliente no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: cliente
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateCliente = async (req: Request & { user?: any }, res: Response) => {
    try {
        const cliente: ICliente = req.body;
        const checkIs = await Cliente.findByPk(cliente.idCliente);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Cliente no encontrado'
        });
        else {
            checkIs.codigo = cliente.codigo;
            checkIs.identificacion = cliente.identificacion;
            checkIs.nombre = cliente.nombre;
            checkIs.estadoCivil = cliente.estadoCivil;
            checkIs.sexo = cliente.sexo;
            checkIs.direccion = cliente.direccion;
            checkIs.telefono = cliente.telefono;
            checkIs.correo = cliente.correo;
            checkIs.esEmpleado = cliente.esEmpleado;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información del cliente ${cliente.nombre}.`)
            res.status(200).json({
                status: true,
                message: 'Datos de cliente actualizados exitosamente',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteCliente = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            res.status(404).json({
                status: false,
                message: 'Cliente no encontrado. Imposible eliminar.'
            });
            return;
        }
        cliente.estado = false; // Marcar como anulado
        await cliente.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el cliente ${cliente.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Cliente eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createCliente,
    getClientes,
    getClienteById,
    updateCliente,
    deleteCliente
}