import { Request, Response } from 'express';
import { Usuario } from '../models/usuarioModel';
import { handleHttp } from '../utils/handleError';
import { encrypt } from '../helpers/handleBcrypt';
import { Rol } from '../models/rolModel';
import { registrarBitacora } from '../utils/bitacoraService';

// Crear un nuevo usuario
const createUsuario = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { nombre, codigo, clave, correo, idRol } = req.body;
        const checkIs = await Usuario.findOne({ where: { codigo } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'Usuario ya existe'
            });
        } else {
            const passHash = await encrypt(clave);
            const newUsuario = await Usuario.create({ nombre, codigo, clave: passHash, correo, idRol });
            await registrarBitacora(req, 'CREACIÓN', 'USUARIO', `Se creó el usuario ${newUsuario.nombre}.`);
            res.status(201).json({
                status: true,
                message: 'Usuario agregado exitosamente. Se envió al correo del usuario las credenciales ',
                data: newUsuario
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

// Obtener todos los usuarios
const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.findAll({
            where: {anulado: false},
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['nombre']
            }]
        });
        res.status(200).json({ value: usuarios });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

// Obtener un usuario por ID
const getUsuarioById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) res.status(404).json({
            status: false,
            message: 'Usuario no encontrado' });
        else res.status(200).json({
            status: true,
            value: usuario});
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

// Actualizar un usuario por ID
const updateUsuario = async (req: Request & { user?: any }, res: Response) => {
    const { idUsuario, nombre, correo, idRol } = req.body;
    try {
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) res.status(404).json({
            status: false,
            message: 'Usuario no encontrado' });
        else {
            usuario.nombre = nombre;
            usuario.correo = correo;
            usuario.idRol = idRol;
            await usuario.save();
            await registrarBitacora(req, 'MODIFICACIÓN', 'USUARIO', `Se modificó informacion del usuario ${usuario.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de usuario actualizados exitosamente',
                value: usuario
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

// Eliminar (anular) un usuario por ID
const deleteUsuario = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    console.log(id);
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) res.status(404).json({
            status: false,
            message: 'Usuario no encontrado' });
        else {
            usuario.anulado = true; // Marcar como anulado
            await usuario.save();
            await registrarBitacora(req, 'ELIMINACIÓN', 'USUARIO', `Se eliminó el usuario ${usuario.nombre}.`);
            res.status(200).json({ 
                status: true,
                message: 'Usuario eliminado correctamente' });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
};