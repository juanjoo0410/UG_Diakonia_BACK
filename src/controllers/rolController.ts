import { Request, Response } from 'express';
import { Rol } from '../models/rolModel';
import { handleHttp } from '../utils/handleError';
import sequelize from "../config/db";
import { RolSubmenu } from '../models/rolSubmenuModel';
import { Op } from 'sequelize';
import { Menu } from '../models/menuModel';
import { Submenu } from '../models/submenuModel';
import { registrarBitacora } from '../utils/bitacoraService';
import { Usuario } from '../models/usuarioModel';
import { RolPermiso } from '../models/RolPermiso.model';
import { Permiso } from '../models/Permiso.model';

// Crear un nuevo rol
const createRol = async (req: Request & { user?: any }, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { nombre, submenus, permisos } = req.body;
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

        if (submenus && submenus.length > 0) {
            const submenusData = submenus.map((submenu: any) => ({
                idRol: newRol.idRol,
                idSubmenu: submenu.idSubmenu,
            }));
            await RolSubmenu.bulkCreate(submenusData, { transaction });
        }

        if (permisos && permisos.length > 0) {
            const permisosData = permisos.map((permiso: any) => ({
                idRol: newRol.idRol,
                idPermiso: permiso.idPermiso,
            }));
            await RolPermiso.bulkCreate(permisosData, { transaction });
        }

        await transaction.commit();
        await registrarBitacora(req, 'CREACIÓN', 'ROL', `Se creó el rol ${newRol.nombre}.`);
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
            include: [
                {
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
                },
                {
                    model: RolPermiso,
                    as: 'roles_permisos',
                    attributes: ['idPermiso'],
                    include: [{
                        model: Permiso,
                        as: 'permiso',
                        attributes: ['idPermiso', 'codigo'],
                    }]
                }],
        });

        const result = roles.map((rol: any) => ({
            idRol: rol.idRol,
            nombre: rol.nombre,
            submenus: (rol.roles_submenus || []).map((item: any) => ({
                idMenu: item.submenu?.idMenu,
                nombreMenu: item.submenu?.menu?.nombre,
                idSubmenu: item.submenu?.idSubmenu,
                nombreSubmenu: item.submenu?.nombre,

            })),
            permisos: (rol.roles_permisos || []).map((item: any) => ({
                idPermiso: item.permiso?.idPermiso,
                codigo: item.permiso?.codigo,
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
const updateRol = async (req: Request & { user?: any }, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        const { idRol, nombre, submenus, permisos } = req.body;
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
        if (submenus && submenus.length > 0) {
            const submenusData = submenus.map((submenu: any) => ({
                idRol,
                idSubmenu: submenu.idSubmenu,
            }));
            await RolSubmenu.bulkCreate(submenusData, { transaction });
        }

        await RolPermiso.destroy({ where: { idRol }, transaction });
        if (permisos && permisos.length > 0) {
            const permisosData = permisos.map((permiso: any) => ({
                idRol,
                idPermiso: permiso.idPermiso,
            }));
            await RolPermiso.bulkCreate(permisosData, { transaction });
        }
        await transaction.commit();
        await registrarBitacora(req, 'MODIFICACIÓN', 'ROL', `Se modificó la información del rol ${rol.nombre}.`)
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
const updateStatusRol = async (req: Request & { user?: any }, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { idRol } = req.params;
        const rol = await Rol.findByPk(idRol, { transaction });
        if (!rol) {
            await transaction.rollback();
            res.status(404).json({ message: 'Rol no encontrado' });
        }
        else {
            let anulado = true;
            const usuario = await Usuario.findOne({ where: { anulado: false, idRol: rol.idRol } });
            if (usuario) {
                res.status(404).json({
                    status: false,
                    message: 'Existen usuarios asignados a este rol. Imposible desactivar.'
                });
                return;
            }
            if (rol.anulado) anulado = false;
            rol.anulado = anulado; // Marcar como anulado
            await rol.save({ transaction });

            await RolSubmenu.destroy({
                where: { idRol },
                transaction,
            });

            await RolPermiso.destroy({
                where: { idRol },
                transaction,
            });
            await transaction.commit();
            await registrarBitacora(req, 'CAMBIO ESTADO', 'ROL', `Se cambió de estado el rol ${rol.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Estado de Rol actualizado con éxito'
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
    updateStatusRol as deleteRol
};