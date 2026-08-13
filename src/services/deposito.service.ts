import sequelize from "../config/db";
import { BaseCRUDService } from "./base-crud.service";
import { KardexTesoreria } from "../models/kardex-tesoreria.model";
import { CajaBanco } from "../models/caja-banco.model";
import { FilterDto } from "../dtos/filter.dto";
import { Usuario } from "../models/usuarioModel";
import { Divisa } from "../models/divisa.model";
import { IDeposito } from "../interfaces/deposito.interface";
import { Deposito } from "../models/deposito.model";
import { DepositoDt } from "../models/deposito-dt.model";
import { IngresoTesoreriaDt } from "../models/ingreso-tesoreria-dt.model";

type ICreationData = Omit<IDeposito, 'id' | 'anulado'>;

export class DepositoService extends BaseCRUDService<Deposito> {
    constructor() {
        super(Deposito);
    }

    public async getDepositoById(id: number, transaction?: any): Promise<Deposito> {
        const deposito = await this.ModelClass.findByPk(id, {
            include: [
                {
                    model: DepositoDt,
                    as: 'detalles',
                    include: [
                        { model: Divisa, as: 'divisa' }
                    ]
                },
                { model: CajaBanco, as: 'cajaBanco' },
                { model: CajaBanco, as: 'caja' },
                { model: Usuario, as: 'creador' }],
            transaction
        });

        if (!deposito) throw new Error('DEPOSITO_NO_ENCONTRADO');
        return deposito;
    }

    public async createDeposito(data: ICreationData): Promise<Deposito> {
        const fechaFormateada = new Date(data.fecha).toISOString().split('T')[0];

        return await sequelize.transaction(async (t) => {
            const nuevoDeposito = await this.ModelClass.create({
                fecha: fechaFormateada,
                tipo: data.tipo,
                descripcion: data.descripcion,
                cajaBancoId: data.cajaBancoId,
                cajaId: data.cajaId,
                divisaId: data.divisaId,
                total: data.total,
                numeroPapeleta: data.numeroPapeleta,
                rutaPapeleta: data.rutaPapeleta,
                nota: data.nota,
                creadorId: data.creadorId
            } as any, { transaction: t });

            const detalles = data.detalles || [];
            if (detalles.length == 0) throw new Error('DT_EMPTY');

            for (const dt of detalles) {
                const ingresoDt = await IngresoTesoreriaDt.findByPk(dt.ingresoTesoreriaDtId, { transaction: t, lock: t.LOCK.UPDATE })
                if (!ingresoDt) throw new Error('INGRESO_DT_ERROR');

                const deposito = Number((Number(dt.valor) + Number(ingresoDt.depositado)).toFixed(2));
                if (deposito > ingresoDt.valor) throw new Error('DEPOSITO_SUPERA_VALOR');

                ingresoDt.depositado = deposito;
                await ingresoDt.save({ transaction: t });
            }

            const detallesToCreate = detalles.map(detalle => {
                const { id, ...restoDelDetalle } = detalle;
                return {
                    ...restoDelDetalle,
                    depositoId: nuevoDeposito.id
                };
            });

            await DepositoDt.bulkCreate(detallesToCreate as any[], { transaction: t });

            const depositoId = nuevoDeposito.id ?? 0;
            const numeroFormateado = depositoId.toString().padStart(10, '0');
            await KardexTesoreria.create({
                cajaBancoId: nuevoDeposito.cajaId,
                documentoId: depositoId,
                numero: numeroFormateado,
                fecha: nuevoDeposito.fecha,
                tipo: nuevoDeposito.tipo,
                descripcion: nuevoDeposito.descripcion,
                tipoValor: 'Efectivo',
                esDebito: false,
                valor: nuevoDeposito.total,
                creadorId: nuevoDeposito.creadorId
            }, { transaction: t });

            await KardexTesoreria.create({
                cajaBancoId: nuevoDeposito.cajaBancoId,
                documentoId: depositoId,
                numero: numeroFormateado,
                fecha: nuevoDeposito.fecha,
                tipo: nuevoDeposito.tipo,
                descripcion: nuevoDeposito.descripcion,
                tipoValor: 'Efectivo',
                esDebito: true,
                valor: nuevoDeposito.total,
                creadorId: nuevoDeposito.creadorId
            }, { transaction: t });

            return await this.getDepositoById(depositoId, t);
        });
    }

    public async getDepositosByDateAndBancoIdAsync(filters: FilterDto): Promise<any[]> {
        const { fechaInicio, fechaFin, cajaBancoId } = filters;
        const fechaIniFormateada = typeof fechaInicio === 'string'
            ? fechaInicio.split('T')[0]
            : fechaInicio.toISOString().split('T')[0];
        const fechaFinFormateada = typeof fechaFin === 'string'
            ? fechaFin.split('T')[0]
            : fechaFin.toISOString().split('T')[0];

        const resultados = await sequelize.query(
            'CALL sp_ObtenerDepositos(:cajaBancoId, :fechaIniFormateada, :fechaFinFormateada)',
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

    public async getIngresosForDepositoAsync(cajaBancoId: number): Promise<any[]> {
        const result = await sequelize.query(
            `CALL sp_ObtenerIngresosParaDeposito(:cajaBancoId)`,
            {
                replacements: { cajaBancoId: cajaBancoId }
            }
        );

        return result || [];
    }
}