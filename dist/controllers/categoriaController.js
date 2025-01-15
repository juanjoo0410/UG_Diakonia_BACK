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
exports.deleteCategoria = exports.updateCategoria = exports.getCategoriaById = exports.getCategoriasByIdSubgrupo = exports.getCategorias = exports.createCategoria = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const categoriaModel_1 = require("../models/categoriaModel");
const productoModel_1 = require("../models/productoModel");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const grupoProductoModel_1 = require("../models/grupoProductoModel");
const subgrupoProductoModel_1 = require("../models/subgrupoProductoModel");
const entidad = 'CATEGORIA';
const createCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const categoria = req.body;
        const checkIs = yield categoriaModel_1.Categoria.findOne({ where: { nombre: categoria.nombre } });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El nombre de la categoria ya existe en la base datos.'
            });
            return;
        }
        categoria.codigo = yield (0, contadorService_1.generarCodigo)('categorias', transaction);
        const newCategoria = yield categoriaModel_1.Categoria.create(categoria, { transaction });
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: `Categoria con codigo ${newCategoria.codigo} agregada exitosamente.`,
            value: newCategoria
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó la categoria ${categoria.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createCategoria = createCategoria;
const getCategorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorias = yield categoriaModel_1.Categoria.findAll({
            where: { estado: true },
            include: [
                {
                    model: grupoProductoModel_1.GrupoProducto,
                    as: 'grupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: subgrupoProductoModel_1.SubgrupoProducto,
                    as: 'subgrupoProducto',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json({ value: categorias });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getCategorias = getCategorias;
const getCategoriasByIdSubgrupo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const categorias = yield categoriaModel_1.Categoria.findAll({
            where: { idSubgrupoProducto: id },
            order: [['nombre', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: categorias
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_IDMENU', error);
    }
});
exports.getCategoriasByIdSubgrupo = getCategoriasByIdSubgrupo;
const getCategoriaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const categoria = yield categoriaModel_1.Categoria.findByPk(id);
        if (!categoria)
            res.status(404).json({
                status: false,
                message: 'Categoría no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: categoria
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getCategoriaById = getCategoriaById;
const updateCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoria = req.body;
        const checkIs = yield categoriaModel_1.Categoria.findByPk(categoria.idCategoria);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Categoría no encontrado'
            });
            return;
        }
        if (categoria.nombre != checkIs.nombre) {
            const nameExist = yield categoriaModel_1.Categoria.findOne({ where: { nombre: categoria.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nombre de la Categoría ya existe'
                });
                return;
            }
        }
        checkIs.nombre = categoria.nombre;
        checkIs.idGrupoProducto = categoria.idGrupoProducto;
        checkIs.idSubgrupoProducto = categoria.idSubgrupoProducto;
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la categoría ${categoria.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Datos de categoria actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateCategoria = updateCategoria;
const deleteCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const categoria = yield categoriaModel_1.Categoria.findByPk(id);
        if (!categoria) {
            res.status(404).json({
                status: false,
                message: 'Categoría no encontrada. Imposible eliminar.'
            });
            return;
        }
        const producto = yield productoModel_1.Producto.findOne({ where: { idCategoria: categoria.idCategoria } });
        if (producto) {
            res.status(404).json({
                status: false,
                message: 'Existen productos asignados a esta categoría. Imposible eliminar.'
            });
            return;
        }
        categoria.estado = false; // Marcar como anulado
        yield categoria.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó la categoría ${categoria.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Categoría eliminada correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteCategoria = deleteCategoria;
