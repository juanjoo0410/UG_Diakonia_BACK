import sequelize from "../config/db";
import { IEgresoTesoreria } from "../interfaces/egreso-tesoreria.interface";
import { EgresoTesoreria } from "../models/egreso-tesoreria.model";
import { BaseCRUDService } from "./base-crud.service";
import { EgresoTesoreriaRubro } from "../models/egreso-tesoreria-rubro.model";
import { IKardexTesoreria } from "../interfaces/kardex-tesoreria.interface";
import { KardexTesoreria } from "../models/kardex-tesoreria.model";

type ICreationData = Omit<IEgresoTesoreria, 'id' | 'anulado'>;

export class EgresoTesoreriaService extends BaseCRUDService<EgresoTesoreria> {
    constructor() {
        super(EgresoTesoreria);
    }

    public async getEgresoById(id: number, transaction?: any): Promise<EgresoTesoreria> {
        const egreso = await this.ModelClass.findByPk(id, {
            include: [{
                model: EgresoTesoreriaRubro,
                as: 'rubros'
            }],
            transaction
        });

        if (!egreso) throw new Error('EGRESO_NO_ENCONTRADO');
        return egreso;
    }

    public async createEgreso(data: ICreationData): Promise<EgresoTesoreria> {
        const fechaFormateada = typeof data.fecha.toISOString().split('T')[0];

        return await sequelize.transaction(async (t) => {
            const nuevoEgreso = await this.ModelClass.create({
                fecha: fechaFormateada,
                tipo: data.tipo,
                descripcion: data.descripcion,
                beneficiarioCedula: data.beneficiarioCedula,
                beneficiarioNombre: data.beneficiarioNombre,
                cajaBancoId: data.cajaBancoId,
                divisaId: data.divisaId,
                cambio: data.cambio,
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

            const egresoId = nuevoEgreso.id ?? 0;
            const kardex: IKardexTesoreria = {
                cajaBancoId: nuevoEgreso.cajaBancoId,
                documentoId: egresoId,
                numero: egresoId.toString().padStart(10, '0'),
                fecha: nuevoEgreso.fecha,
                tipo: nuevoEgreso.tipo,
                descripcion: nuevoEgreso.descripcion,
                tipoValor: 'EFECTIVO',
                esDebito: false,
                valor: nuevoEgreso.valor,
                creadorId: nuevoEgreso.creadorId
            }
            await KardexTesoreria.create(kardex, { transaction: t });

            return await this.getEgresoById(nuevoEgreso.id ?? 0, t);
        });
    }
}