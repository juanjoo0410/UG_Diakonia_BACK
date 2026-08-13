import { IApertura } from "../interfaces/apertura.interface";
import { Apertura } from "../models/apertura.model";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { Op, Transaction } from "sequelize";
import { CajaBanco } from "../models/caja-banco.model";
import { IComprobanteVenta } from "../interfaces/IComprobanteVenta";
import { ComprobanteVenta } from "../models/comprobanteVentaModel";
import { EgresoTesoreria } from "../models/egreso-tesoreria.model";
import { IngresoTesoreria } from "../models/ingreso-tesoreria.model";
import { IngresoTesoreriaService } from "./ingreso-tesoreria.service";
import { IIngresoTesoreria } from "../interfaces/ingreso-tesoreria.interface";
import { TransferenciaBancariaService } from "./transferencia-bancaria.service";
import { ITransferenciaBancaria } from "../interfaces/transferencia-bancaria.interface";
import { ICerrarCajaData } from "../interfaces/cerrar-caja-data.interface";
import { IKardexTesoreria } from "../interfaces/kardex-tesoreria.interface";
import { KardexTesoreria } from "../models/kardex-tesoreria.model";
import { Beneficiario } from "../models/beneficiarioModel";
import { FilterDto } from "../dtos/filter.dto";

type AperturaCreationData = Omit<IApertura, 'id'>;

const ingresoService = new IngresoTesoreriaService();
const transferenciaService = new TransferenciaBancariaService();

export class AperturaCierreService extends BaseCRUDService<Apertura> {
    constructor() {
        super(Apertura);
    }

    public async aperturarCajas(aperturasData: AperturaCreationData[]): Promise<any> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const cajaIds = aperturasData.map(r => r.cajaId);
            const fechaProceso = aperturasData[0].fecha;
            const fechaFormateada = typeof fechaProceso === 'string'
                ? new Date(fechaProceso).toISOString().split('T')[0]
                : fechaProceso.toISOString().split('T')[0];

            const aperturasDuplicadas = await Apertura.findAll({
                where: {
                    fecha: fechaProceso,
                    cajaId: { [Op.in]: cajaIds }
                },
                include: [
                    {
                        model: CajaBanco,
                        as: 'caja',
                        attributes: ['nombre']
                    }
                ],
            });

            if (aperturasDuplicadas.length > 0) {
                const nombresCajas = aperturasDuplicadas.map((reg: any) =>
                    reg.caja ? reg.caja.nombre : `ID: ${reg.cajaId}`
                ).join(', ');

                throw new Error(`Las siguientes cajas ya fueron aperturadas para la fecha ${fechaFormateada}: ${nombresCajas}`);
            }

            const aperturasAbiertas = await Apertura.findAll({
                where: {
                    cajaId: { [Op.in]: cajaIds },
                    cerrada: false,
                    fecha: { [Op.ne]: fechaProceso }
                },
                include: [
                    {
                        model: CajaBanco,
                        as: 'caja',
                        attributes: ['nombre']
                    }
                ],
            });

            if (aperturasAbiertas.length > 0) {
                const listaPendientes = aperturasAbiertas.map((reg: any) => {
                    const nombreCaja = reg.caja ? reg.caja.nombre : `ID: ${reg.cajaId}`;
                    return `${nombreCaja} (${reg.fecha})`;
                }).join(', ');

                throw new Error(`Debe cerrar las siguientes cajas: ${listaPendientes}. `);
            }

            const newAperturas = await this.ModelClass.bulkCreate(aperturasData, { transaction });
            await transaction.commit();
            return newAperturas;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async cerrarCajas(data: ICerrarCajaData, usuarioId: number): Promise<any> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const ingreso = data.ingreso;
            ingreso.creadorId = usuarioId;
            const newIngreso = await ingresoService.createIngreso(ingreso, transaction);

            //Ingreso a caja
            const ingresoId = newIngreso.id ?? 0;
            await KardexTesoreria.create({
                cajaBancoId: newIngreso.cajaBancoCierreId ?? 0,
                documentoId: ingresoId,
                numero: ingresoId.toString().padStart(10, '0'),
                fecha: newIngreso.fecha,
                tipo: newIngreso.tipo,
                descripcion: newIngreso.descripcion,
                tipoValor: '',
                esDebito: true,
                valor: data.totalContribuciones,
                creadorId: usuarioId
            }, { transaction });

            //Egresos de caja
            const egresos = data.ingreso.documentos?.filter(a => a.tipo == 'VALE-CAJA') || [];
            for (const egreso of egresos) {
                const egresoId = egreso.id ?? 0;
                await KardexTesoreria.create({
                    cajaBancoId: newIngreso.cajaBancoCierreId ?? 0,
                    documentoId: egresoId,
                    numero: egresoId.toString().padStart(10, '0'),
                    fecha: egreso.fecha,
                    tipo: egreso.tipo,
                    descripcion: egreso.descripcion,
                    tipoValor: 'Efectivo',
                    esDebito: false,
                    valor: egreso.valor,
                    creadorId: usuarioId
                }, { transaction });
            }

            //Transferencias bancarias
            const transferencias = data.transferencias || [];
            for (const transferencia of transferencias) {
                transferencia.creadorId = usuarioId;
                const newTransferencia = await transferenciaService.createTransferencia(transferencia, transaction);
                const transferenciaId = newTransferencia.id ?? 0;
                await KardexTesoreria.create({
                    cajaBancoId: newTransferencia.cajaBancoOrigenId ?? 0,
                    documentoId: transferenciaId,
                    numero: transferenciaId.toString().padStart(10, '0'),
                    fecha: newTransferencia.fecha,
                    tipo: newTransferencia.tipo,
                    descripcion: newTransferencia.descripcion,
                    tipoValor: 'Transferencia',
                    esDebito: false,
                    valor: newTransferencia.valor,
                    creadorId: usuarioId
                }, { transaction });

                await KardexTesoreria.create({
                    cajaBancoId: newTransferencia.cajaBancoDestinoId ?? 0,
                    documentoId: transferenciaId,
                    numero: transferenciaId.toString().padStart(10, '0'),
                    fecha: newTransferencia.fecha,
                    tipo: newTransferencia.tipo,
                    descripcion: newTransferencia.descripcion,
                    tipoValor: 'Transferencia',
                    esDebito: true,
                    valor: newTransferencia.valor,
                    creadorId: usuarioId
                }, { transaction });
            }

            //Faltante y sobrante
            const aperturaData = data.apertura;
            if (aperturaData.faltante > 0) {
                await KardexTesoreria.create({
                    cajaBancoId: newIngreso.cajaBancoCierreId ?? 0,
                    documentoId: ingresoId,
                    numero: ingresoId.toString().padStart(10, '0'),
                    fecha: newIngreso.fecha,
                    tipo: newIngreso.tipo,
                    descripcion: `Egreso por faltante en Caja ${data.cajaBancoCierreCodigo}`,
                    tipoValor: 'Efectivo',
                    esDebito: false,
                    valor: aperturaData.faltante,
                    creadorId: usuarioId
                }, { transaction });
            }
            else if (aperturaData.sobrante > 0) {
                await KardexTesoreria.create({
                    cajaBancoId: newIngreso.cajaBancoCierreId ?? 0,
                    documentoId: ingresoId,
                    numero: ingresoId.toString().padStart(10, '0'),
                    fecha: newIngreso.fecha,
                    tipo: newIngreso.tipo,
                    descripcion: `Ingreso por sobrante en Caja ${data.cajaBancoCierreCodigo}`,
                    tipoValor: 'Efectivo',
                    esDebito: true,
                    valor: aperturaData.sobrante,
                    creadorId: usuarioId
                }, { transaction });
            }

            //Egreso de caja chica a caja general
            await KardexTesoreria.create({
                cajaBancoId: newIngreso.cajaBancoCierreId ?? 0,
                documentoId: ingresoId,
                numero: ingresoId.toString().padStart(10, '0'),
                fecha: newIngreso.fecha,
                tipo: newIngreso.tipo,
                descripcion: `Transferencia por cierre a Caja ${data.cajaBancoCodigo}`,
                tipoValor: 'Efectivo',
                esDebito: false,
                valor: newIngreso.valor,
                creadorId: usuarioId
            }, { transaction });

            await KardexTesoreria.create({
                cajaBancoId: newIngreso.cajaBancoId,
                documentoId: ingresoId,
                numero: ingresoId.toString().padStart(10, '0'),
                fecha: newIngreso.fecha,
                tipo: newIngreso.tipo,
                descripcion: `Transferencia por cierre de la Caja ${data.cajaBancoCierreCodigo}`,
                tipoValor: 'Efectivo',
                esDebito: true,
                valor: newIngreso.valor,
                creadorId: usuarioId
            }, { transaction });

            const aperturaToUpdate = await this.ModelClass.findByPk(aperturaData.id);
            if (!aperturaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

            aperturaToUpdate.cerrada = true;
            aperturaToUpdate.cerradaPorId = usuarioId;
            aperturaToUpdate.cerradaFecha = new Date();
            aperturaToUpdate.ingresoTesoreriaId = ingresoId;
            aperturaToUpdate.faltante = aperturaData.faltante;
            aperturaToUpdate.sobrante = aperturaData.sobrante;
            const updatedApertura = await aperturaToUpdate.save({ transaction });

            await transaction.commit();
            return updatedApertura;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async getEstadoCajasByFecha(fecha: Date | string): Promise<any[]> {
        const fechaFormateada = typeof fecha === 'string'
            ? fecha.split('T')[0]
            : fecha.toISOString().split('T')[0];

        const resultados = await sequelize.query(
            'CALL sp_ObtenerEstadoCajasPorFecha(:fecha)',
            {
                replacements: { fecha: fechaFormateada }
            }
        );

        return resultados;
    }

    public async getByCajaIdAndFecha(
        cajaId: number,
        fecha: Date | string = new Date()
    ): Promise<Apertura | null> {
        try {
            const fechaFormateada = typeof fecha === 'string'
                ? fecha.split('T')[0]
                : fecha.toISOString().split('T')[0];

            const apertura = await this.ModelClass.findOne({
                where: {
                    cajaId: cajaId,
                    fecha: fechaFormateada
                }
            });

            return apertura;
        } catch (error) {
            throw error;
        }
    }

    public async getByFecha(fecha: Date | string): Promise<Apertura | null> {
        const fechaFormateada = typeof fecha === 'string'
            ? fecha.split('T')[0]
            : fecha.toISOString().split('T')[0];

        const apertura = await this.ModelClass.findOne({
            where: {
                fecha: fechaFormateada
            }
        });

        return apertura;
    }

    public async upsertByFecha(fecha: Date | string, aperturaData: AperturaCreationData): Promise<Apertura> {
        const fechaFormateada = typeof fecha === 'string'
            ? fecha.split('T')[0]
            : fecha.toISOString().split('T')[0];

        return await sequelize.transaction(async (t) => {
            const aperturaExistente = await this.ModelClass.findOne({
                where: { fecha: fechaFormateada },
                transaction: t
            });

            if (aperturaExistente) {
                aperturaExistente.cajaId = aperturaData.cajaId;
                aperturaExistente.encargadoId = aperturaData.encargadoId;
                aperturaExistente.fondoFijo = aperturaData.fondoFijo;
                aperturaExistente.cerrada = aperturaData.cerrada;
                aperturaExistente.cerradaPorId = aperturaData.cerradaPorId;
                aperturaExistente.cerradaFecha = aperturaData.cerradaFecha;
                aperturaExistente.ingresoTesoreriaId = aperturaData.ingresoTesoreriaId;
                aperturaExistente.faltante = aperturaData.faltante;
                aperturaExistente.sobrante = aperturaData.sobrante;
                aperturaExistente.creadorId = aperturaData.creadorId;

                return await aperturaExistente.save({ transaction: t });
            } else {
                const nuevaApertura = await this.ModelClass.create({
                    ...aperturaData,
                    fecha: fechaFormateada
                } as any, { transaction: t });

                return nuevaApertura;
            }
        });
    }

    public async getContribucionesCierreByDateAndCajaIdAsync(fecha: string, cajaId: number): Promise<any> {
        try {
            const fechaFormateada = fecha.split('T')[0];
            const comprobantes = await ComprobanteVenta.findAll({
                where: {
                    cajaId: cajaId,
                    fecha: fechaFormateada,
                    estado: true
                },
                include: [{
                    model: Beneficiario,
                    as: 'beneficiario',
                    attributes: ['nombre']
                }]
            });

            return comprobantes;
        } catch (error) {
            throw error;
        }
    }

    public async getEgresosCierreByDateAndCajaIdAsync(fecha: string, cajaId: number): Promise<EgresoTesoreria[]> {
        try {
            const fechaFormateada = fecha.split('T')[0];
            const egresos = await EgresoTesoreria.findAll({
                where: {
                    cajaBancoId: cajaId,
                    fecha: fechaFormateada,
                    anulado: false
                }
            });

            return egresos;
        } catch (error) {
            throw error;
        }
    }

    public async getAperturaCierreByDateAndCajaIdAsync(filters: FilterDto): Promise<any[]> {
        const { fechaInicio, fechaFin, cajaBancoId } = filters;
        const fechaIniFormateada = typeof fechaInicio === 'string'
            ? fechaInicio.split('T')[0]
            : fechaInicio.toISOString().split('T')[0];
        const fechaFinFormateada = typeof fechaFin === 'string'
            ? fechaFin.split('T')[0]
            : fechaFin.toISOString().split('T')[0];

        const resultados = await sequelize.query(
            'CALL sp_ObtenerAperturaCierres(:cajaBancoId, :fechaIniFormateada, :fechaFinFormateada)',
            {
                replacements: {
                    cajaBancoId: cajaBancoId ? Number(cajaBancoId) : 0,
                    fechaIniFormateada,
                    fechaFinFormateada
                }
            }
        );

        return resultados;
    }
}