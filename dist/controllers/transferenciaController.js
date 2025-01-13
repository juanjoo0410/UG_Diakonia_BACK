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
exports.getTransferenciaById = exports.getTransferencias = exports.createTransferencia = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const db_1 = __importDefault(require("../config/db"));
const transferenciaModel_1 = require("../models/transferenciaModel");
const transferenciaDtModel_1 = require("../models/transferenciaDtModel");
const stockService_1 = require("../utils/stockService");
const kardexService_1 = require("../utils/kardexService");
const entidad = 'TRANSFERENCIA';
const createTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const transferencia = req.body;
        if (!transferencia.transferenciaDt ||
            !Array.isArray(transferencia.transferenciaDt) ||
            transferencia.transferenciaDt.length === 0) {
            res.status(400).json({
                status: false,
                message: "Detalle de la transferencia es requerido"
            });
            return;
        }
        const newTransferencia = yield transferenciaModel_1.Transferencia.create({
            descripcion: transferencia.descripcion,
            idBodegaOrigen: transferencia.idBodegaOrigen,
            idBodegaDestino: transferencia.idBodegaDestino,
            totalPeso: transferencia.totalPeso,
        }, { transaction });
        const detalles = transferencia.transferenciaDt.map((detalle) => {
            var _a;
            return ({
                idTransferencia: (_a = newTransferencia.idTransferencia) !== null && _a !== void 0 ? _a : 0,
                idProducto: detalle.idProducto,
                idBodegaOrigen: detalle.idBodegaOrigen,
                idBodegaDestino: detalle.idBodegaDestino,
                idUbicacionOrigen: detalle.idUbicacionOrigen,
                idUbicacionDestino: detalle.idUbicacionDestino,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            });
        });
        yield transferenciaDtModel_1.TransferenciaDt.bulkCreate(detalles, { transaction });
        const documento = {
            idDocumento: newTransferencia.idTransferencia,
            tipo: entidad,
            detalle: `Egreso: ${newTransferencia.descripcion}`,
            esIngreso: false
        };
        const detallesEg = detalles.map((detalle) => ({
            idProducto: detalle.idProducto,
            idBodega: detalle.idBodegaOrigen,
            idUbicacion: detalle.idUbicacionOrigen,
            cantidad: detalle.cantidad,
            peso: detalle.peso
        }));
        const detallesIng = detalles.map((detalle) => ({
            idProducto: detalle.idProducto,
            idBodega: detalle.idBodegaDestino,
            idUbicacion: detalle.idUbicacionDestino,
            cantidad: detalle.cantidad,
            peso: detalle.peso
        }));
        yield (0, stockService_1.actualizarStock)(detallesEg, documento.esIngreso, transaction);
        yield (0, kardexService_1.agregarKardex)(documento, detallesEg, transaction);
        documento.esIngreso = true;
        documento.detalle = `Ingreso: ${newTransferencia.descripcion}`;
        yield (0, stockService_1.actualizarStock)(detallesIng, documento.esIngreso, transaction);
        yield (0, kardexService_1.agregarKardex)(documento, detallesIng, transaction);
        yield transaction.commit();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó la transferencia ${newTransferencia.idTransferencia}.`);
        res.status(201).json({
            status: true,
            message: 'Transferencia creada con éxito',
            value: newTransferencia
        });
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createTransferencia = createTransferencia;
const getTransferencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencias = yield transferenciaModel_1.Transferencia.findAll({ where: { estado: true } });
        res.status(200).json({ value: transferencias });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getTransferencias = getTransferencias;
const getTransferenciaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const transferencia = yield transferenciaModel_1.Transferencia.findOne({
            where: { idTransferencia: id },
            include: [
                {
                    model: transferenciaDtModel_1.TransferenciaDt,
                    as: "transfDetalles",
                }
            ],
        });
        if (!transferencia)
            res.status(404).json({
                status: false,
                message: 'Transferencia no encontrada'
            });
        else
            res.status(200).json({
                status: true,
                value: transferencia
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getTransferenciaById = getTransferenciaById;
