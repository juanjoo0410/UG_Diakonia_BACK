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
exports.getIngresoById = exports.getIngresos = exports.createIngreso = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const db_1 = __importDefault(require("../config/db"));
const ingresoModel_1 = require("../models/ingresoModel");
const ingresoDtModel_1 = require("../models/ingresoDtModel");
const stockService_1 = require("../utils/stockService");
const kardexService_1 = require("../utils/kardexService");
const entidad = 'INGRESO';
const createIngreso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield db_1.default.transaction();
    try {
        const ingreso = req.body;
        if (!ingreso.ingresoDt ||
            !Array.isArray(ingreso.ingresoDt) ||
            ingreso.ingresoDt.length === 0) {
            res.status(400).json({
                status: false,
                message: "Detalle del ingreso es requerido"
            });
            return;
        }
        const newIngreso = yield ingresoModel_1.Ingreso.create({
            idTipoTransaccion: ingreso.idTipoTransaccion,
            descripcion: ingreso.descripcion,
            idDonante: (_a = ingreso.idDonante) !== null && _a !== void 0 ? _a : 0,
            totalPeso: ingreso.totalPeso,
        }, { transaction });
        const detalles = ingreso.ingresoDt.map((detalle) => {
            var _a;
            return ({
                idIngreso: (_a = newIngreso.idIngreso) !== null && _a !== void 0 ? _a : 0,
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            });
        });
        const documento = {
            idDocumento: newIngreso.idIngreso,
            tipo: entidad,
            detalle: newIngreso.descripcion,
            esIngreso: true
        };
        yield ingresoDtModel_1.IngresoDt.bulkCreate(detalles, { transaction });
        yield (0, stockService_1.actualizarStock)(detalles, true, transaction);
        yield (0, kardexService_1.agregarKardex)(documento, detalles, transaction);
        yield transaction.commit();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el ingreso ${newIngreso.idIngreso}.`);
        res.status(201).json({
            status: true,
            message: 'Ingreso registrado con éxito',
            value: newIngreso
        });
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createIngreso = createIngreso;
const getIngresos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingreso = yield ingresoModel_1.Ingreso.findAll({ where: { estado: true } });
        res.status(200).json({ value: ingreso });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getIngresos = getIngresos;
const getIngresoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ingreso = yield ingresoModel_1.Ingreso.findOne({
            where: { idIngreso: id },
            include: [
                {
                    model: ingresoDtModel_1.IngresoDt, // Relación con el modelo de detalles
                    as: "ingDetalles", // Alias definido en las asociaciones
                }
            ],
        });
        if (!ingreso)
            res.status(404).json({
                status: false,
                message: 'Ingreso no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: ingreso
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getIngresoById = getIngresoById;
