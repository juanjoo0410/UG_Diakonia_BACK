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
exports.deleteBodega = exports.updateBodega = exports.getBodegaById = exports.getBodegasConStockPorProducto = exports.getBodegas = exports.createBodega = void 0;
const bodegaModel_1 = require("../models/bodegaModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const sequelize_1 = require("sequelize");
const ubicacionModel_1 = require("../models/ubicacionModel");
const stockModel_1 = require("../models/stockModel");
const entidad = 'BODEGA';
const createBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bodega = req.body;
        const checkIs = yield bodegaModel_1.Bodega.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { codigo: bodega.codigo },
                    { nombre: { [sequelize_1.Op.like]: `%${bodega.nombre}%` } },
                ],
            }
        });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre o código de la bodega ya existe'
            });
        }
        else {
            yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó tipo de la bodega ${bodega.nombre}.`);
            const newBodega = yield bodegaModel_1.Bodega.create(bodega);
            res.status(201).json({
                status: true,
                message: 'Bodega agregada exitosamente.',
                value: newBodega
            });
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createBodega = createBodega;
const getBodegas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bodegas = yield bodegaModel_1.Bodega.findAll({ where: { estado: true } });
        res.status(200).json({ value: bodegas });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getBodegas = getBodegas;
const getBodegasConStockPorProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bodegas = yield bodegaModel_1.Bodega.findAll({
            where: { estado: true },
            include: [
                {
                    model: stockModel_1.Stock,
                    as: 'stocks',
                    attributes: [],
                    where: {
                        idProducto: id,
                        stock: { [sequelize_1.Op.gt]: 0 } // Filtrar solo donde stock > 0
                    },
                }
            ],
            group: ['idBodega'], // Agrupar por los atributos de Bodega
        });
        res.status(200).json({ value: bodegas });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getBodegasConStockPorProducto = getBodegasConStockPorProducto;
const getBodegaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bodega = yield bodegaModel_1.Bodega.findByPk(id);
        if (!bodega)
            res.status(404).json({
                status: false,
                message: 'Bodega no encontrada'
            });
        else
            res.status(200).json({
                status: true,
                value: bodega
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getBodegaById = getBodegaById;
const updateBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bodega = req.body;
        const checkIs = yield bodegaModel_1.Bodega.findByPk(bodega.idBodega);
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Bodega no encontrada'
            });
        else {
            checkIs.nombre = bodega.nombre;
            checkIs.tipoProducto = bodega.tipoProducto;
            checkIs.responsable = bodega.responsable;
            checkIs.venta = bodega.venta;
            checkIs.averiados = bodega.averiados;
            yield checkIs.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la bodega ${bodega.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de bodega actualizados exitosamente',
                value: checkIs
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateBodega = updateBodega;
const deleteBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const bodega = yield bodegaModel_1.Bodega.findByPk(id);
        if (!bodega) {
            res.status(404).json({
                status: false,
                message: 'Bodega no encontrada. Imposible eliminar.'
            });
            return;
        }
        const ubicacion = yield ubicacionModel_1.Ubicacion.findOne({ where: { idBodega: bodega.idBodega } });
        if (ubicacion) {
            res.status(404).json({
                status: false,
                message: 'Existen ubicaciones asignadas a esta bodega. Imposible eliminar.'
            });
            return;
        }
        bodega.estado = false; // Marcar como anulado
        yield bodega.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó la bodega ${bodega.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Bodega eliminada correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteBodega = deleteBodega;
