import { Transaction } from "sequelize";
import { Stock } from "../models/stockModel";

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

        if (existingStock) {
            const nuevoStock = esIngreso
                ? (+existingStock.stock + +detalle.cantidad)
                : (+existingStock.stock - +detalle.cantidad);
            if (nuevoStock < 0) {
                throw new Error(
                    `El stock para el producto ${detalle.idProducto} en la bodega ${detalle.idBodega} no puede ser negativo.`
                );
            }

            existingStock.stock = nuevoStock;
            await existingStock.save({ transaction });
        } else if (esIngreso) {
            await Stock.create(
                {
                    idProducto: detalle.idProducto,
                    idBodega: detalle.idBodega,
                    idUbicacion: detalle.idUbicacion,
                    stock: detalle.cantidad,
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