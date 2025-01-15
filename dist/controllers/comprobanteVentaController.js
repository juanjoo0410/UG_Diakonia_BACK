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
exports.getComprobanteVentaById = exports.getVentasByTipoPago = exports.getTotalVentasMensual = exports.getComprobantesVenta = exports.createComprobanteVenta = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const db_1 = __importDefault(require("../config/db"));
const comprobanteVentaModel_1 = require("../models/comprobanteVentaModel");
const comprobanteVentaDtModel_1 = require("../models/comprobanteVentaDtModel");
const clienteModel_1 = require("../models/clienteModel");
const stockService_1 = require("../utils/stockService");
const kardexService_1 = require("../utils/kardexService");
const sequelize_1 = require("sequelize");
const entidad = 'COMPROBANTE_VENTA';
const createComprobanteVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const comprobanteVenta = req.body;
        if (!comprobanteVenta.comprobanteVentaDt ||
            !Array.isArray(comprobanteVenta.comprobanteVentaDt) ||
            comprobanteVenta.comprobanteVentaDt.length === 0) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: "Detalle del comprobante es requerido"
            });
            return;
        }
        const newComprobanteVenta = yield comprobanteVentaModel_1.ComprobanteVenta.create({
            idCliente: comprobanteVenta.idCliente,
            tipoPago: comprobanteVenta.tipoPago,
            banco: comprobanteVenta.banco,
            subtotal: comprobanteVenta.subtotal,
            descuento: comprobanteVenta.descuento,
            total: comprobanteVenta.total,
        }, { transaction });
        const cliente = yield clienteModel_1.Cliente.findByPk(comprobanteVenta.idCliente);
        const detalles = comprobanteVenta.comprobanteVentaDt.map((detalle) => {
            var _a;
            return ({
                idComprobanteVenta: (_a = newComprobanteVenta.idComprobanteVenta) !== null && _a !== void 0 ? _a : 0,
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                cantidad: detalle.cantidad,
                precioUnd: detalle.precioUnd,
                subtotal: detalle.subtotal,
                descuento: detalle.descuento,
                total: detalle.total,
                peso: detalle.peso
            });
        });
        const documento = {
            idDocumento: newComprobanteVenta.idComprobanteVenta,
            tipo: entidad,
            detalle: `Venta a cliente: ${cliente === null || cliente === void 0 ? void 0 : cliente.nombre}.`,
            esIngreso: false
        };
        yield comprobanteVentaDtModel_1.ComprobanteVentaDt.bulkCreate(detalles, { transaction });
        yield (0, stockService_1.actualizarStock)(detalles, false, transaction);
        yield (0, kardexService_1.agregarKardex)(documento, detalles, transaction);
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Comprobante de venta creado con éxito',
            value: newComprobanteVenta
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el comprobante de venta ${newComprobanteVenta.idComprobanteVenta}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createComprobanteVenta = createComprobanteVenta;
const getComprobantesVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fechaInicio, fechaFin } = req.body;
    try {
        const comprobanteVenta = yield comprobanteVentaModel_1.ComprobanteVenta.findAll({
            where: {
                estado: true,
                fecha: {
                    [sequelize_1.Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                    model: clienteModel_1.Cliente,
                    as: 'cliente',
                    attributes: ['codigo', 'identificacion', 'nombre', 'esEmpleado']
                }]
        });
        res.status(200).json({ status: true, value: comprobanteVenta });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getComprobantesVenta = getComprobantesVenta;
const getVentasByTipoPago = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        const finMes = new Date();
        finMes.setMonth(finMes.getMonth() + 1); // Siguiente mes
        finMes.setDate(0); // Último día del mes
        finMes.setHours(23, 59, 59, 999);
        const ventasPorTipoPago = yield comprobanteVentaModel_1.ComprobanteVenta.findAll({
            attributes: [["tipoPago", "name"], [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("total")), "value"]],
            where: { fecha: { [sequelize_1.Op.between]: [inicioMes, finMes] } },
            group: ["tipoPago"],
        });
        res.status(200).json({
            status: true,
            value: ventasPorTipoPago
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getVentasByTipoPago = getVentasByTipoPago;
const getTotalVentasMensual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        const finMes = new Date();
        finMes.setMonth(finMes.getMonth() + 1); // Siguiente mes
        finMes.setDate(0); // Último día del mes
        finMes.setHours(23, 59, 59, 999);
        const totalVentas = yield comprobanteVentaModel_1.ComprobanteVenta.findOne({
            attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('total')), 'totalVentas']],
            where: {
                fecha: {
                    [sequelize_1.Op.between]: [inicioMes, finMes],
                },
            },
            raw: true,
        });
        res.status(200).json({
            status: true,
            value: totalVentas
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getTotalVentasMensual = getTotalVentasMensual;
const getComprobanteVentaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const comprobanteVenta = yield comprobanteVentaModel_1.ComprobanteVenta.findOne({
            where: { idComprobanteVenta: id },
            include: [
                {
                    model: comprobanteVentaDtModel_1.ComprobanteVentaDt,
                    as: "comvenDetalles",
                }
            ],
        });
        if (!comprobanteVenta)
            res.status(404).json({
                status: false,
                message: 'Comprobante de venta no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: comprobanteVenta
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getComprobanteVentaById = getComprobanteVentaById;
