import { Request, Response } from 'express';
import { Rol } from '../models/rolModel';
import { handleHttp } from '../utils/handleError';

// Crear un nuevo rol
const createRol = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        const newRol = await Rol.create({nombre});
        res.status(201).json({
            message: 'Rol agregado',
            data: newRol
        });
    } catch (error) {
        handleHttp(res, 'ERROR_POST', error);
    }
};

// Obtener todos los roles
const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Rol.findAll({
            where: {anulado: false},
        });
        res.status(200).json({value: roles});
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

// Obtener un rol por ID
const getRolById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const rol = await Rol.findByPk(id);
        if (!rol) res.status(404).json({ message: 'Rol no encontrado' });
        else res.status(200).json(rol);
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

// Actualizar un rol por ID
const updateRol = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const rol = await Rol.findByPk(id);
        if (!rol) res.status(404).json({ message: 'Rol no encontrado' });
        else {
            rol.nombre = nombre;
            await rol.save();
            res.status(200).json(rol);
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

// Eliminar (anular) un rol por ID
const deleteRol = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const rol = await Rol.findByPk(id);
        if (!rol) res.status(404).json({ message: 'Rol no encontrado' });
        else {
            rol.anulado = true; // Marcar como anulado
            await rol.save();
            res.status(200).json({ message: 'Rol anulado correctamente' });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export { 
    createRol,
    getRoles,
    getRolById,
    updateRol,
    deleteRol
};