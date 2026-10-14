import { Transaction } from "sequelize";
import { Reserva } from "../models/reserva.model";
import { BaseCRUDService } from "./base-crud.service";

export class ReservaService extends BaseCRUDService<Reserva> {
    constructor() {
        super(Reserva);
    }

    public async updateReserva(detalles: any[], esIngreso: boolean, t: Transaction) {
        for (const detalle of detalles) {
            const existingReserva = await Reserva.findOne({
                where: {
                    productoId: detalle.productoId,
                    bodegaId: detalle.bodegaId,
                    ubicacionId: detalle.ubicacionId,
                }, transaction: t,
            });

            if (existingReserva) {
                const nuevaReserva = esIngreso
                    ? (+existingReserva.reserva + +detalle.cantidad)
                    : (+existingReserva.reserva - +detalle.cantidad);
                const nuevoPeso = esIngreso
                    ? (+existingReserva.pesoTotal + +detalle.peso)
                    : (+existingReserva.pesoTotal - +detalle.peso);
                if (nuevaReserva < 0) {
                    throw new Error(
                        `La reserva para el producto ${detalle.productoId} en la bodega ${detalle.bodegaId} no puede ser negativo.`
                    );
                }
                existingReserva.reserva = nuevaReserva;
                existingReserva.pesoTotal = nuevoPeso < 0 ? 0 : nuevoPeso;
                await existingReserva.save({ transaction: t });
            } else if (esIngreso) {
                await Reserva.create(
                    {
                        productoId: detalle.productoId,
                        bodegaId: detalle.bodegaId,
                        ubicacionId: detalle.ubicacionId,
                        reserva: detalle.cantidad,
                        pesoTotal: detalle.peso
                    },
                    { transaction: t }
                );
            } else {
                throw new Error(
                    `No existe reserva para el producto ${detalle.productoId} en la bodega ${detalle.bodegaId}.`
                );
            }
        }
    }
}