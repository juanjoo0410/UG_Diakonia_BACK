import { Transaction } from "sequelize";
import { Stock } from "../models/stockModel";
import { Producto } from "../models/productoModel";

export const actualizarStock = async (
    detalles: any[],
    esIngreso: boolean,
    transaction: Transaction
) => {
    for (const detalle of detalles) {
        const existingStock = await Stock.findOne({
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
                throw new Error(
                    `El stock para el producto ${detalle.idProducto} en la bodega ${detalle.idBodega} no puede ser negativo.`
                );
            }
            existingStock.stock = nuevoStock;
            existingStock.pesoTotal = nuevoPeso;
            await existingStock.save({ transaction });
        } else if (esIngreso) {
            await Stock.create(
                {
                    idProducto: detalle.idProducto,
                    idBodega: detalle.idBodega,
                    idUbicacion: detalle.idUbicacion,
                    stock: detalle.cantidad,
                    pesoTotal: detalle.peso
                },
                { transaction }
            );
        } else {
            throw new Error(
                `No existe stock para el producto ${detalle.idProducto} en la bodega ${detalle.idBodega}.`
            );
        }
    }
};