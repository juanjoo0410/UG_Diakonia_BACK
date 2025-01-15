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
exports.deleteTipoTransaccion = exports.updateTipoTransaccion = exports.getTipoTransaccionById = exports.getTiposTransaccionByEgreso = exports.getTiposTransaccionByIngreso = exports.getTiposTransaccion = exports.createTipoTransaccion = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const tipoTransaccionModel_1 = require("../models/tipoTransaccionModel");
const entidad = 'TIPO_TRANSACCION';
const createTipoTransaccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipoTransaccion = req.body;
        const checkIs = yield tipoTransaccionModel_1.TipoTransaccion.findOne({ where: { nombre: tipoTransaccion.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre del tipo de transaccion ya existe'
            });
        }
        else {
            const newTipoTransaccion = yield tipoTransaccionModel_1.TipoTransaccion.create(tipoTransaccion);
            res.status(201).json({
                status: true,
                message: 'Tipo de transaccion agregado exitosamente.',
                value: newTipoTransaccion
            });
            yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó tipo de transaccion ${tipoTransaccion.nombre}.`);
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createTipoTransaccion = createTipoTransaccion;
const getTiposTransaccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tiposTransaccion = yield tipoTransaccionModel_1.TipoTransaccion.findAll({ where: { estado: true } });
        res.status(200).json({ value: tiposTransaccion });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getTiposTransaccion = getTiposTransaccion;
const getTiposTransaccionByIngreso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tiposTransaccion = yield tipoTransaccionModel_1.TipoTransaccion.findAll({
            where: { ingreso: true },
            order: [['nombre', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: tiposTransaccion
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_IDMENU', error);
    }
});
exports.getTiposTransaccionByIngreso = getTiposTransaccionByIngreso;
const getTiposTransaccionByEgreso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tiposTransaccion = yield tipoTransaccionModel_1.TipoTransaccion.findAll({
            where: { egreso: true },
            order: [['nombre', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: tiposTransaccion
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_IDMENU', error);
    }
});
exports.getTiposTransaccionByEgreso = getTiposTransaccionByEgreso;
const getTipoTransaccionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tipoTransaccion = yield tipoTransaccionModel_1.TipoTransaccion.findByPk(id);
        if (!tipoTransaccion)
            res.status(404).json({
                status: false,
                message: 'Tipo de transaccion no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: tipoTransaccion
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getTipoTransaccionById = getTipoTransaccionById;
const updateTipoTransaccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipoTransaccion = req.body;
        const checkIs = yield tipoTransaccionModel_1.TipoTransaccion.findByPk(tipoTransaccion.idTipoTransaccion);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Tipo de transaccion no encontrado'
            });
            return;
        }
        ;
        if (tipoTransaccion.nombre != checkIs.nombre) {
            const nameExist = yield tipoTransaccionModel_1.TipoTransaccion.findOne({ where: { nombre: tipoTransaccion.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nombre del Tipo de transaccion ya existe'
                });
                return;
            }
        }
        ;
        checkIs.nombre = tipoTransaccion.nombre;
        checkIs.ingreso = tipoTransaccion.ingreso;
        checkIs.egreso = tipoTransaccion.egreso;
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del tipo de transaccion ${tipoTransaccion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Datos de tipo de transaccion actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateTipoTransaccion = updateTipoTransaccion;
const deleteTipoTransaccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tipoTransaccion = yield tipoTransaccionModel_1.TipoTransaccion.findByPk(id);
        if (!tipoTransaccion) {
            res.status(404).json({
                status: false,
                message: 'Tipo de transaccion no encontrado. Imposible eliminar.'
            });
            return;
        }
        tipoTransaccion.estado = false; // Marcar como anulado
        yield tipoTransaccion.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el tipo de transaccion ${tipoTransaccion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Tipo de transaccion eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteTipoTransaccion = deleteTipoTransaccion;
