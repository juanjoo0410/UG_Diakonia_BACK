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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRol = exports.updateRol = exports.getRolById = exports.getRoles = exports.createRol = void 0;
const rolModel_1 = require("../models/rolModel");
const handleError_1 = require("../utils/handleError");
const db_1 = __importDefault(require("../config/db"));
const rolSubmenuModel_1 = require("../models/rolSubmenuModel");
const sequelize_1 = require("sequelize");
const menuModel_1 = require("../models/menuModel");
const submenuModel_1 = require("../models/submenuModel");
const bitacoraService_1 = require("../utils/bitacoraService");
// Crear un nuevo rol
const createRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const { nombre, permisos } = req.body;
        const checkIs = yield rolModel_1.Rol.findOne({ where: { nombre } });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'Rol ya existe'
            });
            return;
        }
        const newRol = yield rolModel_1.Rol.create({ nombre }, { transaction });
        if (permisos && permisos.length > 0) {
            const permisosData = permisos.map((permiso) => ({
                idRol: newRol.idRol,
                idSubmenu: permiso.idSubmenu,
            }));
            yield rolSubmenuModel_1.RolSubmenu.bulkCreate(permisosData, { transaction });
        }
        yield transaction.commit();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', 'ROL', `Se creó el rol ${newRol.nombre}.`);
        res.status(201).json({
            status: true,
            message: 'Rol creado con éxito',
            value: newRol
        });
    }
    catch (error) {
        yield transaction.rollback();
        (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createRol = createRol;
// Obtener todos los roles
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield rolModel_1.Rol.findAll({
            where: { anulado: false },
            include: [{
                    model: rolSubmenuModel_1.RolSubmenu,
                    as: 'roles_submenus',
                    attributes: ['idSubmenu'],
                    include: [{
                            model: submenuModel_1.Submenu,
                            as: 'submenu',
                            attributes: ['idSubmenu', 'nombre', 'idMenu'],
                            include: [{
                                    model: menuModel_1.Menu,
                                    as: 'menu',
                                    attributes: ['nombre']
                                }]
                        }]
                }],
        });
        const result = roles.map((rol) => ({
            idRol: rol.idRol,
            nombre: rol.nombre,
            permisos: (rol.roles_submenus || []).map((permiso) => {
                var _a, _b, _c, _d, _e;
                return ({
                    idMenu: (_a = permiso.submenu) === null || _a === void 0 ? void 0 : _a.idMenu,
                    nombreMenu: (_c = (_b = permiso.submenu) === null || _b === void 0 ? void 0 : _b.menu) === null || _c === void 0 ? void 0 : _c.nombre,
                    idSubmenu: (_d = permiso.submenu) === null || _d === void 0 ? void 0 : _d.idSubmenu,
                    nombreSubmenu: (_e = permiso.submenu) === null || _e === void 0 ? void 0 : _e.nombre,
                });
            }),
        }));
        res.status(200).json({
            status: true,
            value: result
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getRoles = getRoles;
// Obtener un rol por ID
const getRolById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const rol = yield rolModel_1.Rol.findByPk(id);
        if (!rol)
            res.status(404).json({ message: 'Rol no encontrado' });
        else
            res.status(200).json(rol);
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getRolById = getRolById;
// Actualizar un rol por ID
const updateRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const { idRol, nombre, permisos } = req.body;
        const existingRole = yield rolModel_1.Rol.findOne({
            where: { nombre, idRol: { [sequelize_1.Op.ne]: idRol } },
        });
        if (existingRole) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El nombre del rol ya existe en otro registro'
            });
            return;
        }
        const rol = yield rolModel_1.Rol.findByPk(idRol, { transaction });
        if (!rol) {
            yield transaction.rollback();
            res.status(404).json({
                status: false,
                message: 'Rol no encontrado'
            });
            return;
        }
        rol.nombre = nombre;
        yield rol.save({ transaction });
        yield rolSubmenuModel_1.RolSubmenu.destroy({ where: { idRol }, transaction });
        if (permisos && permisos.length > 0) {
            const permisosData = permisos.map((permiso) => ({
                idRol,
                idSubmenu: permiso.idSubmenu,
            }));
            yield rolSubmenuModel_1.RolSubmenu.bulkCreate(permisosData, { transaction });
        }
        yield transaction.commit();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', 'ROL', `Se modificó la información del rol ${rol.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Rol actualizado con éxito',
            value: rol
        });
    }
    catch (error) {
        yield transaction.rollback();
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateRol = updateRol;
// Eliminar (anular) un rol por ID
const deleteRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const { idRol } = req.params;
        const rol = yield rolModel_1.Rol.findByPk(idRol, { transaction });
        if (!rol) {
            yield transaction.rollback();
            res.status(404).json({ message: 'Rol no encontrado' });
        }
        else {
            rol.anulado = true; // Marcar como anulado
            yield rol.save({ transaction });
            yield rolSubmenuModel_1.RolSubmenu.destroy({
                where: { idRol },
                transaction,
            });
            yield transaction.commit();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', 'ROL', `Se eliminó el rol ${rol.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Rol anulado y permisos eliminados con éxito'
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteRol = deleteRol;
