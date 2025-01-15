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
exports.deleteSubmenu = exports.updateSubmenu = exports.getSubmenuById = exports.getSubmenusByIdMenu = exports.getSubmenus = exports.createSubmenu = void 0;
const handleError_1 = require("../utils/handleError");
const submenuModel_1 = require("../models/submenuModel");
const createSubmenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idMenu, nombre, ruta, orden } = req.body;
        const newSubmenu = yield submenuModel_1.Submenu.create({ idMenu, nombre, ruta, orden });
        res.status(201).json({
            status: true,
            message: 'Submenu agregado',
            value: newSubmenu
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createSubmenu = createSubmenu;
const getSubmenus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submenus = yield submenuModel_1.Submenu.findAll({
            where: { anulado: false },
            order: [['idMenu', 'ASC'], ['orden', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: submenus
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getSubmenus = getSubmenus;
const getSubmenusByIdMenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idMenu } = req.params;
    try {
        const submenus = yield submenuModel_1.Submenu.findAll({
            where: { idMenu: idMenu },
            order: [['orden', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: submenus
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_IDMENU', error);
    }
});
exports.getSubmenusByIdMenu = getSubmenusByIdMenu;
const getSubmenuById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const submenu = yield submenuModel_1.Submenu.findByPk(id);
        if (!submenu)
            res.status(404).json({
                status: false,
                message: 'Submenu no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                message: 'Datos de submenu actualizados exitosamente',
                value: submenu
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getSubmenuById = getSubmenuById;
const updateSubmenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { idMenu, nombre, ruta, orden } = req.body;
    try {
        const submenu = yield submenuModel_1.Submenu.findByPk(id);
        if (!submenu)
            res.status(404).json({
                status: false,
                message: 'Submenu no encontrado'
            });
        else {
            submenu.idMenu = idMenu;
            submenu.nombre = nombre;
            submenu.ruta = ruta;
            submenu.orden = orden;
            yield submenu.save();
            res.status(200).json({
                status: true,
                value: submenu
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateSubmenu = updateSubmenu;
const deleteSubmenu = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const submenu = yield submenuModel_1.Submenu.findByPk(id);
        if (!submenu)
            res.status(404).json({
                status: false,
                message: 'Submenu no encontrado'
            });
        else {
            submenu.anulado = true;
            yield submenu.save();
            res.status(200).json({
                status: true,
                message: 'Submenu anulado correctamente'
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteSubmenu = deleteSubmenu;
