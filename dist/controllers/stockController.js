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
exports.getStockProductoByUbicacion = exports.getStock = void 0;
const handleError_1 = require("../utils/handleError");
const stockModel_1 = require("../models/stockModel");
const productoModel_1 = require("../models/productoModel");
const bodegaModel_1 = require("../models/bodegaModel");
const ubicacionModel_1 = require("../models/ubicacionModel");
const entidad = 'TIPO_ORGANIZACION';
const getStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield stockModel_1.Stock.findAll({
            where: { estado: true },
            include: [{
                    model: productoModel_1.Producto,
                    as: 'producto',
                    attributes: ['codigo', 'descripcion', 'sku']
                }, {
                    model: bodegaModel_1.Bodega,
                    as: 'bodega',
                    attributes: ['nombre']
                }, {
                    model: ubicacionModel_1.Ubicacion,
                    as: 'ubicacion',
                    attributes: ['codigo', 'capacidadMaxima']
                }]
        });
        res.status(200).json({ status: true, value: stock });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getStock = getStock;
const getStockProductoByUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idP, idU } = req.params;
        const stock = yield stockModel_1.Stock.findOne({
            where: {
                idProducto: idP,
                idUbicacion: idU
            }
        });
        res.status(200).json({ value: stock });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getStockProductoByUbicacion = getStockProductoByUbicacion;
