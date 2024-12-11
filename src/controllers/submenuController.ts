import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Submenu } from '../models/submenuModel';

const createSubmenu = async (req: Request, res: Response) => {
    try {
        const { idMenu, nombre, ruta, orden } = req.body;
        const newSubmenu = await Submenu.create({ idMenu, nombre, ruta, orden });
        res.status(201).json({
            status: true,
            message: 'Submenu agregado',
            data: newSubmenu
        });
    } catch (error) {
        handleHttp(res, 'ERROR_POST', error);
    }
};

const getSubmenus = async (req: Request, res: Response) => {
    try {
        const submenus = await Submenu.findAll({
            where: { anulado: false },
            order: [['idMenu', 'ASC'], ['orden', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: submenus
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getSubmenusByIdMenu = async (req: Request, res: Response) => {
    const { idMenu } = req.params;
    try {
        const submenus = await Submenu.findAll({
            where: { idMenu: idMenu },
            order: [['orden', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: submenus
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_IDMENU', error);
    }
};

const getSubmenuById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const submenu = await Submenu.findByPk(id);
        if (!submenu) res.status(404).json({
            status: false,
            message: 'Submenu no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: submenu
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateSubmenu = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { idMenu, nombre, ruta, orden } = req.body;
    try {
        const submenu = await Submenu.findByPk(id);
        if (!submenu) res.status(404).json({
            status: false,
            message: 'Submenu no encontrado'
        });
        else {
            submenu.idMenu = idMenu;
            submenu.nombre = nombre;
            submenu.ruta = ruta;
            submenu.orden = orden;
            await submenu.save();
            res.status(200).json({
                status: true,
                value: submenu
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteSubmenu = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const submenu = await Submenu.findByPk(id);
        if (!submenu) res.status(404).json({
            status: false,
            message: 'Submenu no encontrado'
        });
        else {
            submenu.anulado = true;
            await submenu.save();
            res.status(200).json({
                status: true,
                message: 'Submenu anulado correctamente'
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createSubmenu,
    getSubmenus,
    getSubmenusByIdMenu,
    getSubmenuById,
    updateSubmenu,
    deleteSubmenu
};