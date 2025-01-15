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
exports.actualizarStock = void 0;
const stockModel_1 = require("../models/stockModel");
const actualizarStock = (detalles, esIngreso, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    for (const detalle of detalles) {
        const existingStock = yield stockModel_1.Stock.findOne({
            where: {
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
            },
            transaction,
        });
        console.log(esIngreso + " - " + detalle.idUbicacion);
        if (existingStock) {
            const nuevoStock = esIngreso
                ? (+existingStock.stock + +detalle.cantidad)
                : (+existingStock.stock - +detalle.cantidad);
            const nuevoPeso = esIngreso
                ? (+existingStock.pesoTotal + +detalle.peso)
                : (+existingStock.pesoTotal - +detalle.peso);
            if (nuevoStock < 0) {
                throw new Error(`El stock para el producto ${detalle.idProducto} en la bodega ${detalle.idBodega} no puede ser negativo.`);
            }
            existingStock.stock = nuevoStock;
            existingStock.pesoTotal = nuevoPeso;
            yield existingStock.save({ transaction });
        }
        else if (esIngreso) {
            yield stockModel_1.Stock.create({
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                stock: detalle.cantidad,
                pesoTotal: detalle.peso
            }, { transaction });
        }
        else {
            throw new Error(`No existe stock para el producto ${detalle.idProducto} en la bodega ${detalle.idBodega}.`);
        }
    }
});
exports.actualizarStock = actualizarStock;
