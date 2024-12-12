import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { RolSubmenu } from '../models/rolSubmenuModel';
import { Menu } from '../models/menuModel';
import { Submenu } from '../models/submenuModel';
import { Op } from 'sequelize';

const getPermisosByIdRol = async (req: Request, res: Response) => {
    try {
        const { idRol } = req.params;
        const permisos = await RolSubmenu.findAll({
            where: { idRol },
            attributes: [],
            include: [{
                model: Submenu,
                as: 'submenu',
                attributes: ['idSubmenu', 'nombre', 'idMenu', 'ruta', 'orden'], // Agregar "orden" para el ordenamiento
                include: [{
                    model: Menu,
                    as: 'menu',
                    attributes: ['idMenu', 'nombre', 'icono', 'orden'],
                }],
            }],
            order: [
                ['submenu', 'menu', 'orden', 'ASC'],
                ['submenu', 'orden', 'ASC'],
            ],
        });
        const menus = permisos.reduce((acc: any, permiso: any) => {
            const menu = permiso.submenu.menu;
            let existingMenu = acc.find((m: any) => m.idMenu === menu.idMenu);
            if (!existingMenu) {
                existingMenu = {
                    idMenu: menu.idMenu,
                    nombreMenu: menu.nombre,
                    icono: menu.icono,
                    submenus: [],
                };
                acc.push(existingMenu);
            }
            existingMenu.submenus.push({
                idSubmenu: permiso.submenu.idSubmenu,
                nombreSubmenu: permiso.submenu.nombre,
                rutaSubmenu: permiso.submenu.ruta
            });
            return acc;
        }, []);

        const result = {
            idRol: idRol,
            permisos: menus,
        };
        res.status(200).json({
            status: true,
            value: result,
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getIdSubmenusByIdRol = async (req: Request, res: Response) => {
    try {
        const { idRol } = req.params;
        const submenus = await RolSubmenu.findAll({
            where: { idRol },
            attributes: ['idSubmenu']
        });

        const idSubmenus = submenus.map((submenu: any) => submenu.idSubmenu);
        res.status(200).json({
            status: true,
            value: idSubmenus });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_IDSUBMENU', error);
    }
};


export {
    getPermisosByIdRol,
    getIdSubmenusByIdRol
}