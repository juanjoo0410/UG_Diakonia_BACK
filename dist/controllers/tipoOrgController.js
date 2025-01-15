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
exports.deleteTipoOrg = exports.updateTipoOrg = exports.getTipoOrgById = exports.getTiposOrg = exports.createTipoOrg = void 0;
const tipoOrgModel_1 = require("../models/tipoOrgModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const beneficiarioModel_1 = require("../models/beneficiarioModel");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const entidad = 'TIPO_ORGANIZACION';
const createTipoOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const tipoOrg = req.body;
        const checkIs = yield tipoOrgModel_1.TipoOrg.findOne({
            where: { nombre: tipoOrg.nombre, }
        });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El tipo de organización ya existe'
            });
            return;
        }
        tipoOrg.codigo = yield (0, contadorService_1.generarCodigo)('tiposOrg', transaction);
        const newTipoOrg = yield tipoOrgModel_1.TipoOrg.create(tipoOrg);
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Tipo de organización agregado exitosamente.',
            value: newTipoOrg
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el tipo de organización ${tipoOrg.nombre}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createTipoOrg = createTipoOrg;
const getTiposOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tiposOrg = yield tipoOrgModel_1.TipoOrg.findAll({
            where: { estado: true }
        });
        res.status(200).json({ value: tiposOrg });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getTiposOrg = getTiposOrg;
const getTipoOrgById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tipoOrg = yield tipoOrgModel_1.TipoOrg.findByPk(id);
        if (!tipoOrg)
            res.status(404).json({
                status: false,
                message: 'Tipo de organización no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: tipoOrg
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getTipoOrgById = getTipoOrgById;
const updateTipoOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipoOrg = req.body;
        const checkIs = yield tipoOrgModel_1.TipoOrg.findByPk(tipoOrg.idTipoOrg);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Tipo de organización no encontrado'
            });
            return;
        }
        if (tipoOrg.nombre.toLocaleUpperCase() !=
            checkIs.nombre.toLocaleUpperCase()) {
            const nameExist = yield tipoOrgModel_1.TipoOrg.findOne({ where: { nombre: tipoOrg.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del Tipo de organización ya existe'
                });
                return;
            }
        }
        checkIs.codigo = tipoOrg.codigo;
        checkIs.nombre = tipoOrg.nombre;
        checkIs.descripcion = tipoOrg.descripcion;
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del tipo de organización ${tipoOrg.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Datos de tipo de organizacion actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateTipoOrg = updateTipoOrg;
const deleteTipoOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tipoOrg = yield tipoOrgModel_1.TipoOrg.findByPk(id);
        if (!tipoOrg) {
            res.status(404).json({
                status: false,
                message: 'Tipo de organización no encontrado'
            });
            return;
        }
        const beneficiario = yield beneficiarioModel_1.Beneficiario.findOne({ where: { idTipoOrg: tipoOrg.idTipoOrg } });
        if (beneficiario) {
            res.status(404).json({
                status: false,
                message: 'Existen beneficiarios asignados a este tipo de organizacion. Imposible eliminar.'
            });
            return;
        }
        tipoOrg.estado = false; // Marcar como anulado
        yield tipoOrg.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el tipo de organización ${tipoOrg.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Tipo de organización eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteTipoOrg = deleteTipoOrg;
