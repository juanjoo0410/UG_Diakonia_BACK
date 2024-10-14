import { Request, Response } from 'express';
import { Rol } from '../models/rolModel';
import { handleHttp } from '../utils/error.handle';

// Crear un nuevo rol
const createRol = (req: Request, res: Response) => {
    try {
        res.send(req.body);
    } catch (error) {
        handleHttp(res, 'ERROR_POST');
    }
};

// Obtener todos los roles
const getRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const roles = await Rol.findAll();
        return res.status(200).json(roles);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los roles', error });
    }
};

// Obtener un rol por ID
const getRoleById = async (req: Request, res: Response): Promise<Response> => {
    const { idRol } = req.params;
    try {
        const role = await Rol.findByPk(idRol);
        if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
        return res.status(200).json(role);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el rol', error });
    }
};

// Actualizar un rol por ID
const updateRole = async (req: Request, res: Response): Promise<Response> => {
    const { idRol } = req.params;
    const { nombre, anulado }: { nombre: string, anulado: boolean } = req.body;
    try {
        const role = await Rol.findByPk(idRol);
        if (!role) return res.status(404).json({ message: 'Rol no encontrado' });

        role.nombre = nombre;
        role.anulado = anulado;
        await role.save();
        
        return res.status(200).json(role);
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el rol', error });
    }
};

// Eliminar (anular) un rol por ID
const deleteRole = async (req: Request, res: Response): Promise<Response> => {
    const { idRol } = req.params;
    try {
        const role = await Rol.findByPk(idRol);
        if (!role) return res.status(404).json({ message: 'Rol no encontrado' });

        role.anulado = true; // Marcar como anulado
        await role.save();
        
        return res.status(200).json({ message: 'Rol anulado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al anular el rol', error });
    }
};

export { createRol };