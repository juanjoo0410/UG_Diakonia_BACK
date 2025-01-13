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
exports.getIdSubmenusByIdRol = exports.getPermisosByIdRol = void 0;
const handleError_1 = require("../utils/handleError");
const rolSubmenuModel_1 = require("../models/rolSubmenuModel");
const menuModel_1 = require("../models/menuModel");
const submenuModel_1 = require("../models/submenuModel");
const getPermisosByIdRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idRol } = req.params;
        const permisos = yield rolSubmenuModel_1.RolSubmenu.findAll({
            where: { idRol },
            attributes: [],
            include: [{
                    model: submenuModel_1.Submenu,
                    as: 'submenu',
                    attributes: ['idSubmenu', 'nombre', 'idMenu', 'ruta', 'orden'], // Agregar "orden" para el ordenamiento
                    include: [{
                            model: menuModel_1.Menu,
                            as: 'menu',
                            attributes: ['idMenu', 'nombre', 'icono', 'orden'],
                        }],
                }],
            order: [
                ['submenu', 'menu', 'orden', 'ASC'],
                ['submenu', 'orden', 'ASC'],
            ],
        });
        const menus = permisos.reduce((acc, permiso) => {
            const menu = permiso.submenu.menu;
            let existingMenu = acc.find((m) => m.idMenu === menu.idMenu);
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
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getPermisosByIdRol = getPermisosByIdRol;
const getIdSubmenusByIdRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idRol } = req.params;
        const submenus = yield rolSubmenuModel_1.RolSubmenu.findAll({
            where: { idRol },
            attributes: ['idSubmenu']
        });
        const idSubmenus = submenus.map((submenu) => submenu.idSubmenu);
        res.status(200).json({
            status: true,
            value: idSubmenus
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL_IDSUBMENU', error);
    }
});
exports.getIdSubmenusByIdRol = getIdSubmenusByIdRol;
