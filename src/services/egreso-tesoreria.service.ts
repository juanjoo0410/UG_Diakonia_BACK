import sequelize from "../config/db";
import { IEgresoTesoreria } from "../interfaces/egreso-tesoreria.interface";
import { EgresoTesoreria } from "../models/egreso-tesoreria.model";
import { BaseCRUDService } from "./base-crud.service";
import { EgresoTesoreriaRubro } from "../models/egreso-tesoreria-rubro.model";
import { IKardexTesoreria } from "../interfaces/kardex-tesoreria.interface";
import { KardexTesoreria } from "../models/kardex-tesoreria.model";
import { CajaBanco } from "../models/caja-banco.model";
import { FilterDto } from "../dtos/filter.dto";
import { RubroTesoreria } from "../models/rubro-tesoreria.model";
import { Usuario } from "../models/usuarioModel";
import { Divisa } from "../models/divisa.model";
import { CajaBancoService } from "./caja-banco.service";
import { Transaction } from "sequelize";

type ICreationData = Omit<IEgresoTesoreria, 'id' | 'anulado'>;

const cajaBancoService = new CajaBancoService();

export class EgresoTesoreriaService extends BaseCRUDService<EgresoTesoreria> {
    constructor() {
        super(EgresoTesoreria);
    }

    public async getEgresoById(id: number, transaction?: any): Promise<EgresoTesoreria> {
        const egreso = await this.ModelClass.findByPk(id, {
            include: [
                {
                    model: EgresoTesoreriaRubro,
                    as: 'rubros',
                    include: [
                        { model: RubroTesoreria, as: 'rubro' },
                        { model: Divisa, as: 'divisa' }
                    ]
                },
                { model: CajaBanco, as: 'cajaBanco' },
                { model: Usuario, as: 'acreedor' },
                { model: Usuario, as: 'creador' }],
            transaction
        });

        if (!egreso) throw new Error('EGRESO_NO_ENCONTRADO');
        return egreso;
    }

    public async createEgreso(data: ICreationData): Promise<EgresoTesoreria> {
        const fechaFormateada = new Date(data.fecha).toISOString().split('T')[0];

        return await sequelize.transaction(async (t) => {
            const nuevoEgreso = await this.ModelClass.create({
                fecha: fechaFormateada,
                tipo: data.tipo,
                descripcion: data.descripcion,
                cajaBancoId: data.cajaBancoId,
                acreedorId: data.acreedorId,
                divisaId: data.divisaId,
                valor: data.valor,
                cajaCierreId: data.cajaCierreId,
                nota: data.nota,
                creadorId: data.creadorId
            } as any, { transaction: t });

            const detallesToCreate = data.rubros?.map(detalle => {
                const { id, ...restoDelDetalle } = detalle;
                return {
                    ...restoDelDetalle,
                    egresoTesoreriaId: nuevoEgreso.id
                };
            });

            await EgresoTesoreriaRubro.bulkCreate(detallesToCreate as any[], { transaction: t });

            const cajaBanco = await CajaBanco.findByPk(nuevoEgreso.cajaBancoId);
            if (!cajaBanco) throw new Error('CAJA_NO_ENCONTRADA');

            if (!cajaBanco.controlaApertura) {
                const egresoId = nuevoEgreso.id ?? 0;
                const kardex: IKardexTesoreria = {
                    cajaBancoId: nuevoEgreso.cajaBancoId,
                    documentoId: egresoId,
                    numero: egresoId.toString().padStart(10, '0'),
                    fecha: nuevoEgreso.fecha,
                    tipo: nuevoEgreso.tipo,
                    descripcion: nuevoEgreso.descripcion,
                    tipoValor: 'Efectivo',
                    esDebito: false,
                    valor: nuevoEgreso.valor,
                    creadorId: nuevoEgreso.creadorId
                }
                await KardexTesoreria.create(kardex, { transaction: t });
            }

            return await this.getEgresoById(nuevoEgreso.id ?? 0, t);
        });
    }

    public async getValesCajaByDateAsync(filters: FilterDto): Promise<any[]> {
        const { fechaInicio, fechaFin } = filters;
        const fechaIniFormateada = typeof fechaInicio === 'string'
            ? fechaInicio.split('T')[0]
            : fechaInicio.toISOString().split('T')[0];
        const fechaFinFormateada = typeof fechaFin === 'string'
            ? fechaFin.split('T')[0]
            : fechaFin.toISOString().split('T')[0];

        const resultados = await sequelize.query(
            'CALL sp_ObtenerValesCaja(:fechaIniFormateada, :fechaFinFormateada)',
            {
                replacements: {
                    fechaIniFormateada,
                    fechaFinFormateada
                }
            }
        );

        return resultados;
    }

    public async annularEgresoById(id: number, usuarioId: number): Promise<EgresoTesoreria> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const egreso = await this.ModelClass.findByPk(id, { transaction });
            if (!egreso) throw new Error('EGRESO_NO_ENCONTRADO');

            if (egreso.anulado) throw new Error('EGRESO_ANULADO');
            egreso.anulado = true;
            egreso.anuladoPorId = usuarioId;
            egreso.anuladoFecha = new Date();
            await egreso.save({ transaction });

            const cajaBanco = await CajaBanco.findByPk(egreso.cajaBancoId, { transaction });
            if (!cajaBanco) throw new Error('CAJA_NO_ENCONTRADA');
            if (!cajaBanco.controlaApertura) {
                const kardex: IKardexTesoreria = {
                    cajaBancoId: egreso.cajaBancoId,
                    documentoId: id,
                    numero: id.toString().padStart(10, '0'),
                    fecha: egreso.fecha,
                    tipo: egreso.tipo,
                    descripcion: `ANULACIÓN: ${egreso.descripcion}`,
                    tipoValor: 'Efectivo',
                    esDebito: true,
                    valor: egreso.valor,
                    creadorId: egreso.anuladoPorId ?? 0
                }
                await KardexTesoreria.create(kardex, { transaction });
            }
            await transaction.commit();
            return egreso;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}