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
exports.deleteEstablecimiento = exports.updateEstablecimiento = exports.getEstablecimientoById = exports.getEstablecimientos = exports.createEstablecimiento = void 0;
const establecimientoModel_1 = require("../models/establecimientoModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const donanteModel_1 = require("../models/donanteModel");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const entidad = 'ESTABLECIMIENTO';
const createEstablecimiento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const establecimiento = req.body;
        const checkIs = yield establecimientoModel_1.Establecimiento.findOne({
            where: { nombre: establecimiento.nombre, }
        });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El establecimiento ya existe'
            });
            return;
        }
        establecimiento.codigo = yield (0, contadorService_1.generarCodigo)('establecimientos', transaction);
        const newEstablecimiento = yield establecimientoModel_1.Establecimiento.create(establecimiento);
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Establecimiento agregado exitosamente.',
            value: newEstablecimiento
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el establecimiento ${establecimiento.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createEstablecimiento = createEstablecimiento;
const getEstablecimientos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const establecimientos = yield establecimientoModel_1.Establecimiento.findAll({
            where: { estado: true },
            include: [{
                    model: donanteModel_1.Donante,
                    as: 'donante',
                    attributes: ['nombre']
                }]
        });
        res.status(200).json({ value: establecimientos });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getEstablecimientos = getEstablecimientos;
const getEstablecimientoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const establecimiento = yield establecimientoModel_1.Establecimiento.findByPk(id);
        if (!establecimiento)
            res.status(404).json({
                status: false,
                message: 'Establecimiento no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: establecimiento
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getEstablecimientoById = getEstablecimientoById;
const updateEstablecimiento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const establecimiento = req.body;
        const checkIs = yield establecimientoModel_1.Establecimiento.findByPk(establecimiento.idEstablecimiento);
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Establecimiento no encontrado'
            });
        else {
            checkIs.codigo = establecimiento.codigo;
            checkIs.nombre = establecimiento.nombre;
            checkIs.idDonante = establecimiento.idDonante;
            checkIs.direccion = establecimiento.direccion;
            checkIs.telefono = establecimiento.telefono;
            yield checkIs.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del establecimiento ${establecimiento.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de establecimiento actualizados exitosamente',
                value: checkIs
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateEstablecimiento = updateEstablecimiento;
const deleteEstablecimiento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const establecimiento = yield establecimientoModel_1.Establecimiento.findByPk(id);
        if (!establecimiento)
            res.status(404).json({
                status: false,
                message: 'Establecimiento no encontrado'
            });
        else {
            establecimiento.estado = false; // Marcar como anulado
            yield establecimiento.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el establecimiento ${establecimiento.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Establecimiento eliminado correctamente'
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteEstablecimiento = deleteEstablecimiento;
