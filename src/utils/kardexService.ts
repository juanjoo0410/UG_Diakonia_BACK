import { Transaction } from "sequelize";
import { IKardex } from "../interfaces/IKardex";
import { Kardex } from "../models/kardexModel";
import { Producto } from "../models/productoModel";
import { Stock } from "../models/stockModel";

export const agregarKardex = async (
    documento: any,
    detalles: any[],
    transaction: Transaction
) => {
    for (const detalle of detalles) {
        const producto = await Producto.findByPk(detalle.idProducto);
        const stock = await Stock.findOne({
            where: {
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
            },
            transaction,
        });
        if (producto && stock) {
            const unidades = (+producto.unidadesPorPrest * +stock.stock);
            const kardex: IKardex = {
                idDocumento: documento.idDocumento,
                tipo: documento.tipo,
                detalle: documento.detalle,
                idBodega: detalle.idBodega,
                idProducto: detalle.idProducto,
                cantidad: +detalle.cantidad,
                esIngreso: documento.esIngreso,
                unidades: unidades
            };
            await Kardex.create(kardex, { transaction });
        }
        else{
            throw new Error(
                `No existe el producto o stock `
            );
        }
    }
};