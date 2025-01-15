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
exports.agregarKardex = void 0;
const kardexModel_1 = require("../models/kardexModel");
const productoModel_1 = require("../models/productoModel");
const stockModel_1 = require("../models/stockModel");
const agregarKardex = (documento, detalles, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    for (const detalle of detalles) {
        const producto = yield productoModel_1.Producto.findByPk(detalle.idProducto);
        const stock = yield stockModel_1.Stock.findOne({
            where: {
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
            },
            transaction,
        });
        if (producto && stock) {
            const unidades = (+producto.unidadesPorPrest * +stock.stock);
            const kardex = {
                idDocumento: documento.idDocumento,
                tipo: documento.tipo,
                detalle: documento.detalle,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                idProducto: detalle.idProducto,
                cantidad: +detalle.cantidad,
                esIngreso: documento.esIngreso,
                unidades: unidades
            };
            yield kardexModel_1.Kardex.create(kardex, { transaction });
        }
        else {
            throw new Error(`No existe el producto o stock `);
        }
    }
});
exports.agregarKardex = agregarKardex;
