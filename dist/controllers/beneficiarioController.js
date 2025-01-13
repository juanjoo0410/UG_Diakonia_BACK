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
exports.deleteBeneficiario = exports.updateBeneficiario = exports.getBeneficiarioById = exports.getBeneficiarios = exports.createBeneficiario = void 0;
const beneficiarioModel_1 = require("../models/beneficiarioModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const entidad = 'BENEFICIARIO';
const createBeneficiario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const beneficiario = req.body;
        const checkIs = yield beneficiarioModel_1.Beneficiario.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { identificacion: beneficiario.identificacion },
                    { nombre: { [sequelize_1.Op.like]: `%${beneficiario.nombre}%` } },
                ],
            }
        });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc o el nombre del beneficiario ya existen en la base datos.'
            });
            return;
        }
        beneficiario.codigo = yield (0, contadorService_1.generarCodigo)('beneficiarios', transaction);
        const newBeneficiario = yield beneficiarioModel_1.Beneficiario.create(beneficiario);
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Beneficiario agregado exitosamente.',
            value: newBeneficiario
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el beneficiario ${beneficiario.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createBeneficiario = createBeneficiario;
const getBeneficiarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beneficiarios = yield beneficiarioModel_1.Beneficiario.findAll({ where: { estado: true } });
        res.status(200).json({ value: beneficiarios });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getBeneficiarios = getBeneficiarios;
const getBeneficiarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const beneficiario = yield beneficiarioModel_1.Beneficiario.findByPk(id);
        if (!beneficiario)
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: beneficiario
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getBeneficiarioById = getBeneficiarioById;
const updateBeneficiario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const beneficiario = req.body;
        const checkIs = yield beneficiarioModel_1.Beneficiario.findByPk(beneficiario.idBeneficiario);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado'
            });
            return;
        }
        if (beneficiario.nombre != checkIs.nombre) {
            const nameExist = yield beneficiarioModel_1.Beneficiario.findOne({ where: { nombre: beneficiario.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del Beneficiario ya existe'
                });
                return;
            }
        }
        checkIs.nombre = beneficiario.nombre;
        checkIs.tipoBeneficiario = beneficiario.tipoBeneficiario;
        checkIs.idTipoOrg = beneficiario.idTipoOrg;
        checkIs.idTipoPoblacion = beneficiario.idTipoPoblacion;
        checkIs.idClasificacion = beneficiario.idClasificacion;
        checkIs.actividad = beneficiario.actividad;
        checkIs.totalBeneficiarios = beneficiario.totalBeneficiarios;
        checkIs.direccion = beneficiario.direccion;
        checkIs.telefono = beneficiario.telefono;
        checkIs.correo = beneficiario.correo;
        checkIs.nombreContacto = beneficiario.nombreContacto;
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del beneficiario ${beneficiario.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Datos de beneficiario actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateBeneficiario = updateBeneficiario;
const deleteBeneficiario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const beneficiario = yield beneficiarioModel_1.Beneficiario.findByPk(id);
        if (!beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Beneficiario no encontrado. Imposible eliminar.'
            });
            return;
        }
        beneficiario.estado = false; // Marcar como anulado
        yield beneficiario.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el beneficiario ${beneficiario.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Beneficiario eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteBeneficiario = deleteBeneficiario;
