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
exports.deleteidClasificacion = exports.updateidClasificacion = exports.getidClasificacionById = exports.getidClasificaciones = exports.createidClasificacion = void 0;
const clasificacionModel_1 = require("../models/clasificacionModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const beneficiarioModel_1 = require("../models/beneficiarioModel");
const entidad = 'CLASIFICACION';
const createidClasificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clasificacion = req.body;
        const checkIs = yield clasificacionModel_1.Clasificacion.findOne({ where: { nombre: clasificacion.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'La clasificacion ya existe'
            });
        }
        else {
            yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó la clasificacion ${clasificacion.nombre}.`);
            const newClase = yield clasificacionModel_1.Clasificacion.create(clasificacion);
            res.status(201).json({
                status: true,
                message: 'Clasificacion agregada exitosamente.',
                value: newClase
            });
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createidClasificacion = createidClasificacion;
const getidClasificaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clasificaciones = yield clasificacionModel_1.Clasificacion.findAll({ where: { estado: true } });
        res.status(200).json({ value: clasificaciones });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getidClasificaciones = getidClasificaciones;
const getidClasificacionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const clasificacion = yield clasificacionModel_1.Clasificacion.findByPk(id);
        if (!clasificacion)
            res.status(404).json({
                status: false,
                message: 'Clasificacion no encontrada'
            });
        else
            res.status(200).json({
                status: true,
                value: clasificacion
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getidClasificacionById = getidClasificacionById;
const updateidClasificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clasificacion = req.body;
        const checkIs = yield clasificacionModel_1.Clasificacion.findByPk(clasificacion.idClasificacion);
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Clasificacion no encontrada'
            });
        else {
            checkIs.nombre = clasificacion.nombre;
            yield checkIs.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la clasificacion ${clasificacion.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de clasificacion actualizados exitosamente',
                value: checkIs
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateidClasificacion = updateidClasificacion;
const deleteidClasificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const clasificacion = yield clasificacionModel_1.Clasificacion.findByPk(id);
        if (!clasificacion) {
            res.status(404).json({
                status: false,
                message: 'Clasificacion no encontrada. Imposible eliminar.'
            });
            return;
        }
        const beneficiario = yield beneficiarioModel_1.Beneficiario.findOne({
            where: { idClasificacion: clasificacion.idClasificacion }
        });
        if (beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Existen tipos de organizaciones asignados a esta clase. Imposible eliminar.'
            });
            return;
        }
        clasificacion.estado = false; // Marcar como anulado
        yield clasificacion.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó la Clasificacion ${clasificacion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Clasificacion eliminada correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteidClasificacion = deleteidClasificacion;
