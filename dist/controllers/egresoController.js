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
exports.getEgresoById = exports.getEgresos = exports.createEgreso = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const db_1 = __importDefault(require("../config/db"));
const egresoModel_1 = require("../models/egresoModel");
const egresoDtModel_1 = require("../models/egresoDtModel");
const stockService_1 = require("../utils/stockService");
const kardexService_1 = require("../utils/kardexService");
const entidad = 'EGRESO';
const createEgreso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield db_1.default.transaction();
    try {
        const egreso = req.body;
        if (!egreso.egresoDt ||
            !Array.isArray(egreso.egresoDt) ||
            egreso.egresoDt.length === 0) {
            res.status(400).json({
                status: false,
                message: "Detalle del egreso es requerido"
            });
            return;
        }
        const newEgreso = yield egresoModel_1.Egreso.create({
            idTipoTransaccion: egreso.idTipoTransaccion,
            descripcion: egreso.descripcion,
            idBeneficiario: (_a = egreso.idBeneficiario) !== null && _a !== void 0 ? _a : 0,
            totalPeso: egreso.totalPeso,
        }, { transaction });
        const detalles = egreso.egresoDt.map((detalle) => {
            var _a;
            return ({
                idEgreso: (_a = newEgreso.idEgreso) !== null && _a !== void 0 ? _a : 0,
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            });
        });
        const documento = {
            idDocumento: newEgreso.idEgreso,
            tipo: entidad,
            detalle: newEgreso.descripcion,
            esIngreso: false
        };
        yield egresoDtModel_1.EgresoDt.bulkCreate(detalles, { transaction });
        yield (0, stockService_1.actualizarStock)(detalles, false, transaction);
        yield (0, kardexService_1.agregarKardex)(documento, detalles, transaction);
        yield transaction.commit();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el egreso ${newEgreso.idEgreso}.`);
        res.status(201).json({
            status: true,
            message: 'Egreso realizado con éxito',
            value: newEgreso
        });
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createEgreso = createEgreso;
const getEgresos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const egreso = yield egresoModel_1.Egreso.findAll({ where: { estado: true } });
        res.status(200).json({ value: egreso });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getEgresos = getEgresos;
const getEgresoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const egreso = yield egresoModel_1.Egreso.findOne({
            where: { idEgreso: id },
            include: [
                {
                    model: egresoDtModel_1.EgresoDt,
                    as: "egDetalles",
                }
            ],
        });
        if (!egreso)
            res.status(404).json({
                status: false,
                message: 'Egreso no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: egreso
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getEgresoById = getEgresoById;
