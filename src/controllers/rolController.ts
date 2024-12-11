import { Request, Response } from 'express';
import { Rol } from '../models/rolModel';
import { handleHttp } from '../utils/handleError';
import sequelize from "../config/db";
import { RolSubmenu } from '../models/rolSubmenuModel';
import { Op } from 'sequelize';
import { Menu } from '../models/menuModel';
import { Submenu } from '../models/submenuModel';

// Crear un nuevo rol
const createRol = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { nombre, permisos } = req.body;
        const checkIs = await Rol.findOne({ where: { nombre } });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'Rol ya existe'
            });
            return;
        }
        const newRol = await Rol.create({ nombre }, { transaction });

        if (permisos && permisos.length > 0) {
            const permisosData = permisos.map((permiso: any) => ({
                idRol: newRol.idRol,
                idSubmenu: permiso.idSubmenu,
            }));
            await RolSubmenu.bulkCreate(permisosData, { transaction });
        }

        await transaction.commit();

        res.status(201).json({
            status: true,
            message: 'Rol creado con éxito',
            value: newRol
        });
    } catch (error) {
        await transaction.rollback();
        handleHttp(res, 'ERROR_POST', error);
    }
};

// Obtener todos los roles
const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Rol.findAll({
            where: { anulado: false },
            include: [{
                model: RolSubmenu,
                as: 'roles_submenus',
                attributes: ['idSubmenu'],
                include: [{
                    model: Submenu,
                    as: 'submenu',
                    attributes: ['idSubmenu', 'nombre', 'idMenu'],
                    include: [{
                        model: Menu,
                        as: 'menu',
                        attributes: ['nombre']
                    }]
                }]
            }],
        });

        const result = roles.map((rol: any) => ({
            idRol: rol.idRol,
            nombre: rol.nombre,
            permisos: (rol.roles_submenus || []).map((permiso: any) => ({
                idMenu: permiso.submenu?.idMenu,
                nombreMenu: permiso.submenu?.menu?.nombre,
                idSubmenu: permiso.submenu?.idSubmenu,
                nombreSubmenu: permiso.submenu?.nombre,

            })),
        }));

        res.status(200).json({
            status: true,
            value: result
        });
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
    const transaction = await sequelize.transaction();

    try {
        const { idRol, nombre, permisos } = req.body;
        const existingRole = await Rol.findOne({
            where: { nombre, idRol: { [Op.ne]: idRol } },
        });

        if (existingRole) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El nombre del rol ya existe en otro registro'
            });
            return;
        }
        const rol = await Rol.findByPk(idRol, { transaction });
        if (!rol) {
            await transaction.rollback();
            res.status(404).json({
                status: false,
                message: 'Rol no encontrado'
            });
            return;
        }
        rol.nombre = nombre;
        await rol.save({ transaction });
        await RolSubmenu.destroy({ where: { idRol }, transaction });
        if (permisos && permisos.length > 0) {
            const permisosData = permisos.map((permiso: any) => ({
                idRol,
                idSubmenu: permiso.idSubmenu,
            }));
            await RolSubmenu.bulkCreate(permisosData, { transaction });
        }
        await transaction.commit();
        res.status(200).json({
            status: true,
            message: 'Rol actualizado con éxito',
            value: rol
        });
    } catch (error) {
        await transaction.rollback();
        handleHttp(res, 'ERROR_PUT', error);
    }
};

// Eliminar (anular) un rol por ID
const deleteRol = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { idRol } = req.params;
        const rol = await Rol.findByPk(idRol, { transaction });
        if (!rol) {
            await transaction.rollback();
            res.status(404).json({ message: 'Rol no encontrado' });
        }
        else {
            rol.anulado = true; // Marcar como anulado
            await rol.save({ transaction });

            await RolSubmenu.destroy({
                where: { idRol },
                transaction,
            });
            await transaction.commit();
            res.status(200).json({
                status: true,
                message: 'Rol anulado y permisos eliminados con éxito'
            });
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