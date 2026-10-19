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
import { ReservaService } from "./reserva.service";
import { FilterDto } from "../dtos/filter.dto";
import { EmpresaPatrocinadora } from "../models/empresa-patrocinadora.model";
import { ComprobanteContribucionService } from "./comprobante-contribucion.service";
import { IComprobanteVenta } from "../interfaces/IComprobanteVenta";
import { actualizarStock } from "../utils/stockService";
import { agregarKardex } from "../utils/kardexService";
import { IDataResponse } from "../interfaces/data-response.interface";
import { getNumeroSemana } from "../utils/utilsService";

type ICreationData = Omit<IPedidoCorporativo, 'id' | 'anulado'>;

const reservaService = new ReservaService();
const comprobanteService = new ComprobanteContribucionService();

export class PedidoCorporativoService extends BaseCRUDService<PedidoCorporativo> {
    constructor() {
        super(PedidoCorporativo);
    }

    public async getPedidoCorporativoById(id: number, transaction?: any): Promise<PedidoCorporativo> {
        const pedido = await this.ModelClass.findByPk(id, {
            include: [
                {
                    model: EmpresaPatrocinadora, as: 'empresaPatrocinadora'
                },
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

    public async createPedidoCorporativo(data: ICreationData): Promise<IDataResponse<PedidoCorporativo>> {
        return await sequelize.transaction(async (t) => {
            const newPedido = await this.ModelClass.create({
                tipo: data.tipo,
                descripcion: data.descripcion,
                empresaPatrocinadoraId: data.empresaPatrocinadoraId,
                tipoContribucion: data.tipoContribucion,
                banco: data.banco,
                subtotal: data.subtotal,
                descuento: data.descuento,
                valorCupon: data.valorCupon,
                diferenciaEfectivo: data.diferenciaEfectivo,
                total: data.total,
                totalPeso: data.totalPeso,
                usuario: data.usuario,
                nota: data.nota,
                emitido: data.emitido,
                creadorId: data.creadorId
            } as any, { transaction: t });

            const detallesToCreate = data.detalles?.map(detalle => {
                const { id, ...restoDelDetalle } = detalle;
                return {
                    ...restoDelDetalle,
                    pedidoCorporativoId: newPedido.id
                };
            });

            const beneficiariosToCreate = data.beneficiarios?.map(beneficiario => {
                const { id, ...restoDelDetalle } = beneficiario;
                return {
                    ...restoDelDetalle,
                    pedidoCorporativoId: newPedido.id
                };
            });

            await PedidoCorporativoDt.bulkCreate(detallesToCreate as any[], { transaction: t });
            await PedidoCorporativoBeneficiario.bulkCreate(beneficiariosToCreate as any[], { transaction: t });

            let comprobanteId: number = 0;
            if (data.emitido) {
                //Crear comprobante
                const comprobante: IComprobanteVenta = {
                    empresaPatrocinadoraId: data.empresaPatrocinadoraId,
                    tipoPago: data.tipoContribucion,
                    banco: data.banco,
                    subtotal: data.subtotal,
                    descuento: data.descuento,
                    valorCupon: data.valorCupon,
                    diferenciaEfectivo: data.diferenciaEfectivo,
                    total: data.total,
                    totalPeso: data.totalPeso,
                    usuario: data.usuario,
                    cajaId: data.cajaId,
                    bancoTransferenciaId: data.bancoTransferenciaId,
                    pedidoCorporativoId: newPedido.id,
                    semana: getNumeroSemana(new Date().toDateString()),
                    comprobanteVentaDt: data.detalles?.map(dt => ({
                        idComprobanteVenta: 0,
                        idProducto: dt.productoId,
                        idBodega: dt.bodegaId,
                        idUbicacion: dt.ubicacionId,
                        cantidad: dt.cantidad,
                        precioUnd: dt.precioUnd,
                        subtotal: dt.subtotal,
                        descuento: dt.descuento,
                        total: dt.total,
                        peso: dt.peso
                    })) || []
                };

                const newComprobante = await comprobanteService.createComprobanteContribucion(comprobante, t);
                if (!newComprobante) throw new Error('COMPROBANTE_NO_EMITIDO');

                comprobanteId = newComprobante?.idComprobanteVenta ?? 0;
                const empresa = await EmpresaPatrocinadora.findByPk(data.empresaPatrocinadoraId, { transaction: t });
                const dataKardex = {
                    idDocumento: comprobanteId,
                    tipo: 'CONTRIBUCION CORPORATIVA',
                    detalle: `Comprobante Corporativo: ${empresa?.nombre ?? ''}.`,
                    esIngreso: false
                }

                await actualizarStock(comprobante?.comprobanteVentaDt || [], false, t);
                await agregarKardex(dataKardex, comprobante?.comprobanteVentaDt || [], t);
            }
            else {
                //Actualizar reserva de productos
                await reservaService.updateReserva(detallesToCreate as any[], true, t);
            }

            return {
                message: (data.emitido ? 'Comprobante emitido exitosamente.' : 'Pedido creado exitosamente.'),
                obj: newPedido,
                documentId: comprobanteId
            };
        });
    }

    public async updatePedidoCorporativo(data: IPedidoCorporativo): Promise<IDataResponse<PedidoCorporativo>> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const pedidoToUpdate = await this.ModelClass.findByPk(data.id, { transaction });
            if (!pedidoToUpdate) throw new Error('DOCUMENTO_NO_ENCONTRADO');
            if (pedidoToUpdate.anulado) throw new Error('DOCUMENTO_ANULADO');

            pedidoToUpdate.tipo = data.tipo;
            pedidoToUpdate.descripcion = data.descripcion;
            pedidoToUpdate.empresaPatrocinadoraId = data.empresaPatrocinadoraId;
            pedidoToUpdate.tipoContribucion = data.tipoContribucion;
            pedidoToUpdate.banco = data.banco;
            pedidoToUpdate.subtotal = data.subtotal;
            pedidoToUpdate.descuento = data.descuento;
            pedidoToUpdate.valorCupon = data.valorCupon;
            pedidoToUpdate.diferenciaEfectivo = data.diferenciaEfectivo;
            pedidoToUpdate.total = data.total;
            pedidoToUpdate.totalPeso = data.totalPeso;
            pedidoToUpdate.usuario = data.usuario;
            pedidoToUpdate.nota = data.nota;
            pedidoToUpdate.emitido = data.emitido;
            await pedidoToUpdate.save({ transaction });

            //Quitar reservas de productos
            const pedidoDt = await PedidoCorporativoDt.findAll({ where: { pedidoCorporativoId: data.id }, transaction });
            await reservaService.updateReserva(pedidoDt as any[], false, transaction);

            //Eliminar registros
            await PedidoCorporativoDt.destroy({ where: { pedidoCorporativoId: data.id }, transaction });
            await PedidoCorporativoBeneficiario.destroy({ where: { pedidoCorporativoId: data.id }, transaction });

            const detallesToCreate = data.detalles?.map(detalle => {
                const { id, ...restoDelDetalle } = detalle;
                return {
                    ...restoDelDetalle,
                    pedidoCorporativoId: data.id
                };
            });

            const beneficiariosToCreate = data.beneficiarios?.map(beneficiario => {
                const { id, ...restoDelDetalle } = beneficiario;
                return {
                    ...restoDelDetalle,
                    pedidoCorporativoId: data.id
                };
            });

            await PedidoCorporativoDt.bulkCreate(detallesToCreate as any[], { transaction });
            await PedidoCorporativoBeneficiario.bulkCreate(beneficiariosToCreate as any[], { transaction });

            let comprobanteId: number = 0;
            if (data.emitido) {
                //Crear comprobante
                const comprobante: IComprobanteVenta = {
                    empresaPatrocinadoraId: data.empresaPatrocinadoraId,
                    tipoPago: data.tipoContribucion,
                    banco: data.banco,
                    subtotal: data.subtotal,
                    descuento: data.descuento,
                    valorCupon: data.valorCupon,
                    diferenciaEfectivo: data.diferenciaEfectivo,
                    total: data.total,
                    totalPeso: data.totalPeso,
                    usuario: data.usuario,
                    cajaId: data.cajaId,
                    bancoTransferenciaId: data.bancoTransferenciaId,
                    pedidoCorporativoId: data.id,
                    semana: getNumeroSemana(new Date().toDateString()),
                    comprobanteVentaDt: data.detalles?.map(dt => ({
                        idComprobanteVenta: 0,
                        idProducto: dt.productoId,
                        idBodega: dt.bodegaId,
                        idUbicacion: dt.ubicacionId,
                        cantidad: dt.cantidad,
                        precioUnd: dt.precioUnd,
                        subtotal: dt.subtotal,
                        descuento: dt.descuento,
                        total: dt.total,
                        peso: dt.peso
                    })) || []
                };

                const newComprobante = await comprobanteService.createComprobanteContribucion(comprobante, transaction);
                if (!newComprobante) throw new Error('COMPROBANTE_NO_EMITIDO');

                comprobanteId = newComprobante?.idComprobanteVenta ?? 0;
                const empresa = await EmpresaPatrocinadora.findByPk(data.empresaPatrocinadoraId, { transaction });
                const dataKardex = {
                    idDocumento: comprobanteId,
                    tipo: 'CONTRIBUCION CORPORATIVA',
                    detalle: `Comprobante Corporativo: ${empresa?.nombre ?? ''}.`,
                    esIngreso: false
                }

                await actualizarStock(comprobante?.comprobanteVentaDt || [], false, transaction);
                await agregarKardex(dataKardex, comprobante?.comprobanteVentaDt || [], transaction);
            }
            else {
                //Actualizar reserva de productos
                await reservaService.updateReserva(detallesToCreate as any[], true, transaction);
            }

            await transaction.commit();
            return {
                message: (data.emitido ? 'Comprobante emitido exitosamente.' : 'Pedido actualizado exitosamente.'),
                obj: pedidoToUpdate,
                documentId: comprobanteId
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
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

            //Quitar reservas de productos
            const pedidoDt = await PedidoCorporativoDt.findAll({ where: { pedidoCorporativoId: id }, transaction });
            await reservaService.updateReserva(pedidoDt as any[], false, transaction);

            await transaction.commit();
            return pedido;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async getPedidosByDateAndEmpresaIdAsync(filters: FilterDto): Promise<any[]> {
        const { fechaInicio, fechaFin, empresaPatrocinadoraId } = filters;
        const fechaIniFormateada = typeof fechaInicio === 'string'
            ? fechaInicio.split('T')[0]
            : fechaInicio.toISOString().split('T')[0];
        const fechaFinFormateada = typeof fechaFin === 'string'
            ? fechaFin.split('T')[0]
            : fechaFin.toISOString().split('T')[0];

        const result = await sequelize.query(
            'CALL sp_ObtenerPedidosCorporativos(:fechaIniFormateada, :fechaFinFormateada, :empresaPatrocinadoraId)',
            {
                replacements: {
                    fechaIniFormateada,
                    fechaFinFormateada,
                    empresaPatrocinadoraId: empresaPatrocinadoraId ? Number(empresaPatrocinadoraId) : 0
                }
            }
        );

        return result;
    }
}