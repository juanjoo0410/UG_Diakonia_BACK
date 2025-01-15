"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenu = exports.updateMenu = exports.getMenuById = exports.getMenus = exports.createMenu = void 0;
const handleError_1 = require("../utils/handleError");
const menuModel_1 = require("../models/menuModel");
const createMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, icono, ruta, orden } = req.body;
        const newMenu = yield menuModel_1.Menu.create({ nombre, icono, ruta, orden });
        res.status(201).json({
            status: true,
            message: 'Menu agregado',
            value: newMenu
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createMenu = createMenu;
const getMenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const menus = yield menuModel_1.Menu.findAll({
            where: { anulado: false },
            order: [['orden', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: menus
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getMenus = getMenus;
const getMenuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const menu = yield menuModel_1.Menu.findByPk(id);
        if (!menu)
            res.status(404).json({
                status: false,
                message: 'Menu no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: menu
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getMenuById = getMenuById;
const updateMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, icono, ruta, orden } = req.body;
    try {
        const menu = yield menuModel_1.Menu.findByPk(id);
        if (!menu)
            res.status(404).json({
                status: false,
                message: 'Menu no encontrado'
            });
        else {
            menu.nombre = nombre;
            menu.icono = icono;
            menu.ruta = ruta;
            menu.orden = orden;
            yield menu.save();
            res.status(200).json({
                status: true,
                message: 'Datos de menu actualizados exitosamente',
                value: menu
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateMenu = updateMenu;
const deleteMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const menu = yield menuModel_1.Menu.findByPk(id);
        if (!menu)
            res.status(404).json({
                status: false,
                message: 'Menu no encontrado'
            });
        else {
            menu.anulado = true;
            yield menu.save();
            res.status(200).json({
                status: true,
                message: 'Menu anulado correctamente'
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteMenu = deleteMenu;
