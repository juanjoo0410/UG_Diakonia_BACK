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
exports.deleteGrupoProducto = exports.updateGrupoProducto = exports.getGrupoProductoById = exports.getGruposProducto = exports.createGrupoProducto = void 0;
const grupoProductoModel_1 = require("../models/grupoProductoModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const subgrupoProductoModel_1 = require("../models/subgrupoProductoModel");
const productoModel_1 = require("../models/productoModel");
const contadorService_1 = require("../utils/contadorService");
const db_1 = __importDefault(require("../config/db"));
const entidad = 'GRUPO_PRODUCTO';
const createGrupoProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const grupoProducto = req.body;
        const checkIs = yield grupoProductoModel_1.GrupoProducto.findOne({ where: { nombre: grupoProducto.nombre } });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El nombre del grupo de producto ya existe'
            });
            return;
        }
        grupoProducto.codigo = yield (0, contadorService_1.generarCodigo)('gruposProducto', transaction);
        const newGrupoProducto = yield grupoProductoModel_1.GrupoProducto.create(grupoProducto, { transaction });
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: `Grupo de producto con codigo ${newGrupoProducto.codigo} agregado exitosamente.`,
            data: newGrupoProducto
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el grupo de producto ${grupoProducto.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createGrupoProducto = createGrupoProducto;
const getGruposProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gruposProducto = yield grupoProductoModel_1.GrupoProducto.findAll({ where: { estado: true } });
        res.status(200).json({ value: gruposProducto });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getGruposProducto = getGruposProducto;
const getGrupoProductoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const grupoProducto = yield grupoProductoModel_1.GrupoProducto.findByPk(id);
        if (!grupoProducto)
            res.status(404).json({
                status: false,
                message: 'Grupo de producto no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: grupoProducto
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getGrupoProductoById = getGrupoProductoById;
const updateGrupoProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grupoProducto = req.body;
        const checkIs = yield grupoProductoModel_1.GrupoProducto.findByPk(grupoProducto.idGrupoProducto);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Grupo de producto no encontrado'
            });
            return;
        }
        if (grupoProducto.nombre != checkIs.nombre) {
            const nameExist = yield grupoProductoModel_1.GrupoProducto.findOne({ where: { nombre: grupoProducto.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del grupo de producto ya existe'
                });
                return;
            }
        }
        checkIs.nombre = grupoProducto.nombre;
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del grupo de producto ${grupoProducto.nombre}.`);
        res.status(200).json({
            status: true,
            essage: 'Datos de grupo actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateGrupoProducto = updateGrupoProducto;
const deleteGrupoProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const grupoProducto = yield grupoProductoModel_1.GrupoProducto.findByPk(id);
        if (!grupoProducto) {
            res.status(404).json({
                status: false,
                message: 'Grupo de producto no encontrado. Imposible eliminar.'
            });
            return;
        }
        const subgrupoProducto = yield subgrupoProductoModel_1.SubgrupoProducto.findOne({
            where: {
                idGrupoProducto: grupoProducto.idGrupoProducto
            }
        });
        if (subgrupoProducto) {
            res.status(404).json({
                status: false,
                message: 'Existen subgrupos de producto asignados a este grupo. Imposible eliminar.'
            });
            return;
        }
        const producto = yield productoModel_1.Producto.findOne({ where: { idGrupoProducto: grupoProducto.idGrupoProducto } });
        if (producto) {
            res.status(404).json({
                status: false,
                message: 'Existen productos asignados a este grupo. Imposible eliminar.'
            });
            return;
        }
        grupoProducto.estado = false; // Marcar como anulado
        yield grupoProducto.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el grupo de producto ${grupoProducto.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Grupo de producto eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteGrupoProducto = deleteGrupoProducto;
