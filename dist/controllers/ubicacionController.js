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
exports.deleteUbicacion = exports.updateUbicacion = exports.getEspacioDisponible = exports.getUbicacionById = exports.getUbicacionesConStockByProducto = exports.getUbicacionesByIdBodega = exports.getUbicaciones = exports.createUbicacion = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const ubicacionModel_1 = require("../models/ubicacionModel");
const bodegaModel_1 = require("../models/bodegaModel");
const stockModel_1 = require("../models/stockModel");
const sequelize_1 = require("sequelize");
const entidad = 'UBICACION';
const createUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicacion = req.body;
        const checkIs = yield ubicacionModel_1.Ubicacion.findOne({
            where: { codigo: ubicacion.codigo, }
        });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'La ubicación ya existe'
            });
        }
        else {
            yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó la ubicación ${ubicacion.codigo}.`);
            const newUbicacion = yield ubicacionModel_1.Ubicacion.create(ubicacion);
            res.status(201).json({
                status: true,
                message: 'Ubicación agregada exitosamente.',
                value: newUbicacion
            });
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createUbicacion = createUbicacion;
const getUbicaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicaciones = yield ubicacionModel_1.Ubicacion.findAll({
            where: { estado: true },
            include: [{
                    model: bodegaModel_1.Bodega,
                    as: 'bodega',
                    attributes: ['nombre']
                }]
        });
        res.status(200).json({ value: ubicaciones });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getUbicaciones = getUbicaciones;
const getUbicacionesByIdBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ubicacion = yield ubicacionModel_1.Ubicacion.findAll({
            where: { idBodega: id },
            order: [['codigo', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: ubicacion
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_IDMENU', error);
    }
});
exports.getUbicacionesByIdBodega = getUbicacionesByIdBodega;
const getUbicacionesConStockByProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idP, idB } = req.params;
        const ubicaciones = yield ubicacionModel_1.Ubicacion.findAll({
            where: { estado: true },
            include: [
                {
                    model: stockModel_1.Stock,
                    as: 'stocks',
                    attributes: [],
                    where: {
                        idProducto: idP,
                        idBodega: idB,
                        stock: { [sequelize_1.Op.gt]: 0 } // Filtrar solo donde stock > 0
                    },
                }
            ],
            group: ['idUbicacion'], // Agrupar por los atributos de Bodega
        });
        console.log('AQUI ESTOY');
        console.log(ubicaciones);
        res.status(200).json({ value: ubicaciones });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getUbicacionesConStockByProducto = getUbicacionesConStockByProducto;
const getUbicacionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ubicacion = yield ubicacionModel_1.Ubicacion.findByPk(id);
        if (!ubicacion)
            res.status(404).json({
                status: false,
                message: 'Ubicación no encontrada'
            });
        else
            res.status(200).json({
                status: true,
                value: ubicacion
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getUbicacionById = getUbicacionById;
const getEspacioDisponible = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        let totalPeso = yield stockModel_1.Stock.sum('pesoTotal', { where: { idUbicacion: id, }, });
        if (totalPeso === null) {
            totalPeso = 0;
        }
        const ubicacion = yield ubicacionModel_1.Ubicacion.findOne({ where: { idUbicacion: id, }, });
        if (!ubicacion) {
            res.status(404).json({
                status: false,
                message: 'Ubicación no encontrada'
            });
            return;
        }
        const capacidadMaxima = ubicacion.capacidadMaxima;
        const diferencia = capacidadMaxima - totalPeso;
        res.status(200).json({
            status: true,
            value: diferencia
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getEspacioDisponible = getEspacioDisponible;
const updateUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicacion = req.body;
        const checkIs = yield ubicacionModel_1.Ubicacion.findByPk(ubicacion.idUbicacion);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Ubicación no encontrada'
            });
            return;
        }
        checkIs.idBodega = ubicacion.idBodega;
        checkIs.capacidadMaxima = ubicacion.capacidadMaxima;
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la ubicacion ${ubicacion.codigo}.`);
        res.status(200).json({
            status: true,
            message: 'Datos de ubicacion actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateUbicacion = updateUbicacion;
const deleteUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ubicacion = yield ubicacionModel_1.Ubicacion.findByPk(id);
        if (!ubicacion) {
            res.status(404).json({
                status: false,
                message: 'Ubicación no encontrada'
            });
            return;
        }
        ubicacion.estado = false; // Marcar como anulado
        yield ubicacion.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó la ubicación ${ubicacion.codigo}.`);
        res.status(200).json({
            status: true,
            message: 'Ubicación eliminada correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteUbicacion = deleteUbicacion;
