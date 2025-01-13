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
exports.getEntidades = exports.getAcciones = exports.getBitacora = void 0;
const usuarioModel_1 = require("../models/usuarioModel");
const handleError_1 = require("../utils/handleError");
const rolModel_1 = require("../models/rolModel");
const bitacoraModel_1 = require("../models/bitacoraModel");
const sequelize_1 = require("sequelize");
const getBitacora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fechaInicio, fechaFin } = req.body;
    try {
        const bitacora = yield bitacoraModel_1.Bitacora.findAll({
            where: {
                fecha: {
                    [sequelize_1.Op.between]: [fechaInicio, fechaFin],
                },
            }, include: [{
                    model: usuarioModel_1.Usuario,
                    as: 'usuario',
                    attributes: ['nombre'],
                    include: [{
                            model: rolModel_1.Rol,
                            as: 'rol',
                            attributes: ['idRol', 'nombre']
                        }]
                }],
            order: [['fecha', 'DESC']]
        });
        res.status(200).json({
            status: true,
            value: bitacora
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getBitacora = getBitacora;
const getAcciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const acciones = yield bitacoraModel_1.Bitacora.findAll({
            attributes: [
                'accion',
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('accion')), 'total'] // Cuenta cuántas veces aparece cada acción
            ],
            group: ['accion'], // Agrupa por el campo 'accion'
            order: [['accion', 'ASC']],
        });
        res.status(200).json({
            status: true,
            value: acciones
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getAcciones = getAcciones;
const getEntidades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entidades = yield bitacoraModel_1.Bitacora.findAll({
            attributes: [
                'entidad',
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('entidad')), 'total'] // Cuenta cuántas veces aparece cada acción
            ],
            group: ['entidad'], // Agrupa por el campo 'accion'
            order: [['entidad', 'ASC']],
        });
        res.status(200).json({
            status: true,
            value: entidades
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getEntidades = getEntidades;
