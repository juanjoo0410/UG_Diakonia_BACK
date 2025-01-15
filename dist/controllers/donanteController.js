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
exports.deleteDonante = exports.updateDonante = exports.getDonanteById = exports.getTotalDonantes = exports.getDonantes = exports.createDonante = void 0;
const donanteModel_1 = require("../models/donanteModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const establecimientoModel_1 = require("../models/establecimientoModel");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const entidad = 'DONANTE';
const createDonante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const donante = req.body;
        const checkIs = yield donanteModel_1.Donante.findOne({ where: { identificacion: donante.identificacion } });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc del donante ya existe'
            });
            return;
        }
        donante.codigo = yield (0, contadorService_1.generarCodigo)('donantes', transaction);
        const newdonante = yield donanteModel_1.Donante.create(donante);
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: `Donante con codigo ${newdonante.codigo} agregado exitosamente.`,
            value: newdonante
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el donante ${donante.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createDonante = createDonante;
const getDonantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donantes = yield donanteModel_1.Donante.findAll({ where: { estado: true } });
        res.status(200).json({ value: donantes });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getDonantes = getDonantes;
const getTotalDonantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalDonantes = yield donanteModel_1.Donante.count({
            where: {
                estado: true,
            },
        });
        res.status(200).json({ status: true, value: totalDonantes });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getTotalDonantes = getTotalDonantes;
const getDonanteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const donante = yield donanteModel_1.Donante.findByPk(id);
        if (!donante)
            res.status(404).json({
                status: false,
                message: 'Donante no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: donante
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getDonanteById = getDonanteById;
const updateDonante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donante = req.body;
        const checkIs = yield donanteModel_1.Donante.findByPk(donante.idDonante);
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Donante no encontrado'
            });
        else {
            checkIs.codigo = donante.codigo;
            checkIs.identificacion = donante.identificacion;
            checkIs.nombre = donante.nombre;
            checkIs.tipoPersona = donante.tipoPersona;
            checkIs.direccion = donante.direccion;
            checkIs.telefono = donante.telefono;
            checkIs.correo = donante.correo;
            checkIs.nombreContacto = donante.nombreContacto;
            checkIs.abreviatura = donante.abreviatura;
            yield checkIs.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del donante ${donante.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de donante actualizados exitosamente',
                value: checkIs
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateDonante = updateDonante;
const deleteDonante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const donante = yield donanteModel_1.Donante.findByPk(id);
        if (!donante) {
            res.status(404).json({
                status: false,
                message: 'Donante no encontrado. Imposible eliminar.'
            });
            return;
        }
        ;
        const establecimientos = yield establecimientoModel_1.Establecimiento.findOne({ where: { idDonante: donante.idDonante } });
        if (establecimientos) {
            res.status(404).json({
                status: false,
                message: 'Existen establecimientos asignados a este donante. Imposible eliminar.'
            });
            return;
        }
        ;
        donante.estado = false; // Marcar como anulado
        yield donante.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el donante ${donante.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Donante eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteDonante = deleteDonante;
