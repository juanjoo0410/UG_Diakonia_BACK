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
exports.deleteTipoPoblacion = exports.updateTipoPoblacion = exports.getTipoPoblacionById = exports.getTiposPoblacion = exports.createTipoPoblacion = void 0;
const tipoPoblacionModel_1 = require("../models/tipoPoblacionModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const beneficiarioModel_1 = require("../models/beneficiarioModel");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const entidad = 'TIPO_POBLACIÓN';
const createTipoPoblacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const tipoPoblacion = req.body;
        const checkIs = yield tipoPoblacionModel_1.TipoPoblacion.findOne({ where: { nombre: tipoPoblacion.nombre } });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El nombre del tipo de poblacion ya existe'
            });
            return;
        }
        tipoPoblacion.codigo = yield (0, contadorService_1.generarCodigo)('tiposPoblacion', transaction);
        const newTipoPoblacion = yield tipoPoblacionModel_1.TipoPoblacion.create(tipoPoblacion);
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Tipo de poblacion agregado exitosamente.',
            value: newTipoPoblacion
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó tipo de población ${tipoPoblacion.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createTipoPoblacion = createTipoPoblacion;
const getTiposPoblacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipoPoblacion = yield tipoPoblacionModel_1.TipoPoblacion.findAll({ where: { estado: true } });
        res.status(200).json({ value: tipoPoblacion });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getTiposPoblacion = getTiposPoblacion;
const getTipoPoblacionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tipoPoblacion = yield tipoPoblacionModel_1.TipoPoblacion.findByPk(id);
        if (!tipoPoblacion)
            res.status(404).json({
                status: false,
                message: 'Tipo de población no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: tipoPoblacion
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getTipoPoblacionById = getTipoPoblacionById;
const updateTipoPoblacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipoPoblacion = req.body;
        const checkIs = yield tipoPoblacionModel_1.TipoPoblacion.findByPk(tipoPoblacion.idTipoPoblacion);
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Tipo de población no encontrado'
            });
        else {
            checkIs.nombre = tipoPoblacion.nombre;
            checkIs.descripcion = tipoPoblacion.descripcion;
            yield checkIs.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del tipo de población ${tipoPoblacion.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de tipo de poblacion actualizados exitosamente',
                value: checkIs
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateTipoPoblacion = updateTipoPoblacion;
const deleteTipoPoblacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tipoPoblacion = yield tipoPoblacionModel_1.TipoPoblacion.findByPk(id);
        if (!tipoPoblacion) {
            res.status(404).json({
                status: false,
                message: 'Tipo de población no encontrado. Imposible eliminar.'
            });
            return;
        }
        const beneficiario = yield beneficiarioModel_1.Beneficiario.findOne({ where: { idTipoPoblacion: tipoPoblacion.idTipoPoblacion } });
        if (beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Existen beneficiarios asignados a este tipo de población. Imposible eliminar.'
            });
            return;
        }
        tipoPoblacion.estado = false; // Marcar como anulado
        yield tipoPoblacion.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el tipo de poblacion ${tipoPoblacion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Tipo de población eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteTipoPoblacion = deleteTipoPoblacion;
