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
exports.deleteSubgrupoProducto = exports.updateSubgrupoProducto = exports.getSubgrupoProductoById = exports.getSubgruposByIdGrupo = exports.getSubgruposProducto = exports.createSubgrupoProducto = void 0;
const subgrupoProductoModel_1 = require("../models/subgrupoProductoModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const productoModel_1 = require("../models/productoModel");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const grupoProductoModel_1 = require("../models/grupoProductoModel");
const entidad = 'SUBGRUPO_PRODUCTO';
const createSubgrupoProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const subgrupoProducto = req.body;
        const checkIs = yield subgrupoProductoModel_1.SubgrupoProducto.findOne({
            where: { nombre: subgrupoProducto.nombre, }
        });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El subgrupo de producto ya existe'
            });
            return;
        }
        subgrupoProducto.codigo = yield (0, contadorService_1.generarCodigo)('subgruposProducto', transaction);
        const newSubgrupoProducto = yield subgrupoProductoModel_1.SubgrupoProducto.create(subgrupoProducto, { transaction });
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: `Subgrupo de producto con codigo ${newSubgrupoProducto.codigo} agregado exitosamente.`,
            value: newSubgrupoProducto
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el grupo de producto ${subgrupoProducto.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createSubgrupoProducto = createSubgrupoProducto;
const getSubgruposProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subgruposProducto = yield subgrupoProductoModel_1.SubgrupoProducto.findAll({
            where: { estado: true },
            include: [{
                    model: grupoProductoModel_1.GrupoProducto,
                    as: 'grupoProducto',
                    attributes: ['nombre']
                }]
        });
        res.status(200).json({ value: subgruposProducto });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getSubgruposProducto = getSubgruposProducto;
const getSubgruposByIdGrupo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idGrupo } = req.params;
    try {
        const subgrupos = yield subgrupoProductoModel_1.SubgrupoProducto.findAll({
            where: { idGrupoProducto: idGrupo },
            order: [['nombre', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: subgrupos
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_IDMENU', error);
    }
});
exports.getSubgruposByIdGrupo = getSubgruposByIdGrupo;
const getSubgrupoProductoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const subgrupoProducto = yield subgrupoProductoModel_1.SubgrupoProducto.findByPk(id);
        if (!subgrupoProducto)
            res.status(404).json({
                status: false,
                message: 'Subgrupo de producto no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: subgrupoProducto
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getSubgrupoProductoById = getSubgrupoProductoById;
const updateSubgrupoProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subgrupoProducto = req.body;
        const checkIs = yield subgrupoProductoModel_1.SubgrupoProducto.findByPk(subgrupoProducto.idSubgrupoProducto);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Subgrupo de producto no encontrado'
            });
            return;
        }
        if (subgrupoProducto.nombre != checkIs.nombre) {
            const nameExist = yield subgrupoProductoModel_1.SubgrupoProducto.findOne({ where: { nombre: subgrupoProducto.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del subgrupo de producto ya existe'
                });
                return;
            }
        }
        checkIs.codigo = subgrupoProducto.codigo;
        checkIs.nombre = subgrupoProducto.nombre;
        checkIs.idGrupoProducto = subgrupoProducto.idGrupoProducto;
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del subgrupo de producto ${subgrupoProducto.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Datos de subgrupo actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateSubgrupoProducto = updateSubgrupoProducto;
const deleteSubgrupoProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const subgrupoProducto = yield subgrupoProductoModel_1.SubgrupoProducto.findByPk(id);
        if (!subgrupoProducto) {
            res.status(404).json({
                status: false,
                message: 'Subgrupo de producto no encontrado'
            });
            return;
        }
        const producto = yield productoModel_1.Producto.findOne({ where: { idSubgrupoProducto: subgrupoProducto.idSubgrupoProducto } });
        if (producto) {
            res.status(404).json({
                status: false,
                message: 'Existen productos asignados a este subgrupo. Imposible eliminar.'
            });
            return;
        }
        subgrupoProducto.estado = false; // Marcar como anulado
        yield subgrupoProducto.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el subgrupo de producto ${subgrupoProducto.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Subgrupo de producto eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteSubgrupoProducto = deleteSubgrupoProducto;
