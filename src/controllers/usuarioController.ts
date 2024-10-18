import { Request, Response } from 'express';
import { Usuario } from '../models/usuarioModel';
import { handleHttp } from '../utils/handleError';
import { encrypt } from '../helpers/handleBcrypt';
import { Rol } from '../models/rolModel';

// Crear un nuevo usuario
const createUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, codigo, clave, idRol } = req.body;
        const checkIs = await Usuario.findOne({ where: { codigo } });
        if (checkIs) {
            res.status(400).json({ message: 'Usuario ya existe' });
        } else {
            const passHash = await encrypt(clave);
            const newUsuario = await Usuario.create({ nombre, codigo, clave: passHash, idRol });
            res.status(201).json({
                message: 'Usuario agregado',
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
            include: [{
                model: Rol,
                attributes: ['nombre']
            }]
        });
        res.status(200).json(usuarios);
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

// Obtener un usuario por ID
const getUsuarioById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) res.status(404).json({ message: 'Usuario no encontrado' });
        else res.status(200).json(usuario);
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

// Actualizar un usuario por ID
const updateUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, clave, idRol } = req.body;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) res.status(404).json({ message: 'Usuario no encontrado' });
        else {
            const passHash = await encrypt(clave);
            usuario.nombre = nombre;
            usuario.clave = passHash;
            usuario.idRol = idRol;
            await usuario.save();
            res.status(200).json(usuario);
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

// Eliminar (anular) un usuario por ID
const deleteUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) res.status(404).json({ message: 'Usuario no encontrado' });
        else {
            usuario.anulado = true; // Marcar como anulado
            await usuario.save();
            res.status(200).json({ message: 'Usuario anulado correctamente' });
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