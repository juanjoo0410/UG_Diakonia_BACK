import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Menu } from '../models/menuModel';

const createMenu = async (req: Request, res: Response) => {
    try {
        const { idMenu, nombre, icono, ruta, orden } = req.body;
        const newMenu = await Menu.create({ idMenu, nombre, icono, ruta, orden });
        res.status(201).json({
            status: true,
            message: 'Menu agregado',
            value: newMenu
        });
    } catch (error) {
        handleHttp(res, 'ERROR_POST', error);
    }
};

const getMenus = async (req: Request, res: Response) => {
    try {
        const menus = await Menu.findAll({
            where: {anulado: false},
            order: [['orden', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: menus
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getMenuById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const menu = await Menu.findByPk(id);
        if (!menu) res.status(404).json({
            status: false,
            message: 'Menu no encontrado'
        });
        else res.status(200).json({
                status: true,
                value: menu
            });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateMenu = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, icono, ruta, orden } = req.body;
    try {
        const menu = await Menu.findByPk(id);
        if (!menu) res.status(404).json({
            status: false,
            message: 'Menu no encontrado' });
        else {
            menu.nombre = nombre;
            menu.icono = icono;
            menu.ruta = ruta;
            menu.orden = orden;
            await menu.save();
            res.status(200).json({
                status: true,
                message: 'Datos de menu actualizados exitosamente',
                value: menu
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteMenu = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const menu = await Menu.findByPk(id);
        if (!menu) res.status(404).json({
            status: false,
            message: 'Menu no encontrado'});
        else {
            menu.anulado = true;
            await menu.save();
            res.status(200).json({
                status: true,
                message: 'Menu anulado correctamente' });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createMenu,
    getMenus,
    getMenuById,
    updateMenu,
    deleteMenu
};