import { IApertura } from "../interfaces/apertura.interface";
import { Apertura } from "../models/apertura.model";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { Op, Transaction } from "sequelize";
import { CajaBanco } from "../models/caja-banco.model";

type AperturaCreationData = Omit<IApertura, 'id'>;

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
}