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
exports.getKardex = void 0;
const handleError_1 = require("../utils/handleError");
const kardexModel_1 = require("../models/kardexModel");
const sequelize_1 = require("sequelize");
const bodegaModel_1 = require("../models/bodegaModel");
const productoModel_1 = require("../models/productoModel");
const entidad = 'KARDEX';
const getKardex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fechaInicio, fechaFin } = req.body;
    try {
        const kardex = yield kardexModel_1.Kardex.findAll({
            where: {
                fecha: {
                    [sequelize_1.Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                    model: bodegaModel_1.Bodega,
                    as: 'bodega',
                    attributes: ['codigo', 'nombre']
                }, {
                    model: productoModel_1.Producto,
                    as: 'producto',
                    attributes: ['descripcion', 'prest', 'sku']
                }]
        });
        res.status(200).json({ status: true, value: kardex });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getKardex = getKardex;
