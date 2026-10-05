import sequelize from "../config/db";
import { BaseCRUDService } from "./base-crud.service";
import { Transaction } from "sequelize";
import { IPedidoCorporativo } from "../interfaces/pedido-corporativo.interface";
import { PedidoCorporativo } from "../models/pedido-corporativo.model";
import { PedidoCorporativoDt } from "../models/pedido-corporativo-dt.model";
import { PedidoCorporativoBeneficiario } from "../models/pedido-corporativo-beneficiario.model";
import { Producto } from "../models/productoModel";
import { Bodega } from "../models/bodegaModel";
import { Ubicacion } from "../models/ubicacionModel";
import { Beneficiario } from "../models/beneficiarioModel";

type ICreationData = Omit<IPedidoCorporativo, 'id' | 'anulado'>;

export class PedidoCorporativoService extends BaseCRUDService<PedidoCorporativo> {
    constructor() {
        super(PedidoCorporativo);
    }

    public async getPedidoCorporativoById(id: number, transaction?: any): Promise<PedidoCorporativo> {
        const pedido = await this.ModelClass.findByPk(id, {
            include: [
                {
                    model: PedidoCorporativoDt, as: 'detalles',
                    include: [
                        { model: Producto, as: 'producto' },
                        { model: Bodega, as: 'bodega' },
                        { model: Ubicacion, as: 'ubicacion' }
                    ]
                },
                {
                    model: PedidoCorporativoBeneficiario, as: 'beneficiarios',
                    include: [
                        { model: Beneficiario, as: 'beneficiario' }
                    ]
                }],
            transaction
        });

        if (!pedido) throw new Error('PEDIDO_NO_ENCONTRADO');
        return pedido;
    }

    public async createPedidoCorporativo(data: ICreationData): Promise<PedidoCorporativo> {
        const fechaFormateada = new Date(data.fecha).toISOString().split('T')[0];

        return await sequelize.transaction(async (t) => {
            const nuevoPedido = await this.ModelClass.create({
                fecha: fechaFormateada,
                tipo: data.tipo,
                descripcion: data.descripcion,
                empresaPatrocinadoraId: data.empresaPatrocinadoraId,
                tipoPago: data.tipoPago,
                banco: data.banco,
                subtotal: data.subtotal,
                descuento: data.descuento,
                valorCupon: data.valorCupon,
                diferenciaEfectivo: data.diferenciaEfectivo,
                total: data.total,
                totalPeso: data.totalPeso,
                usuario: data.usuario,
                nota: data.nota,
                creadorId: data.creadorId
            } as any, { transaction: t });

            const detallesToCreate = data.detalles?.map(detalle => {
                const { id, ...restoDelDetalle } = detalle;
                return {
                    ...restoDelDetalle,
                    pedidoCorporativoId: nuevoPedido.id
                };
            });

            const beneficiariosToCreate = data.beneficiarios?.map(beneficiario => {
                const { id, ...restoDelDetalle } = beneficiario;
                return {
                    ...restoDelDetalle,
                    pedidoCorporativoId: nuevoPedido.id
                };
            });

            await PedidoCorporativoDt.bulkCreate(detallesToCreate as any[], { transaction: t });
            await PedidoCorporativoBeneficiario.bulkCreate(beneficiariosToCreate as any[], { transaction: t });

            return await this.getPedidoCorporativoById(nuevoPedido.id ?? 0, t);
        });
    }

    public async annularPedidoCorporativoById(id: number, usuarioId: number): Promise<PedidoCorporativo> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const pedido = await this.ModelClass.findByPk(id, { transaction });
            if (!pedido) throw new Error('PEDIDO_NO_ENCONTRADO');

            if (pedido.anulado) throw new Error('PEDIDO_ANULADO');
            pedido.anulado = true;
            pedido.anuladoPorId = usuarioId;
            pedido.anuladoFecha = new Date();
            await pedido.save({ transaction });

            await transaction.commit();
            return pedido;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}