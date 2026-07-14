import sequelize from "../config/db";
import { IEgresoTesoreria } from "../interfaces/egreso-tesoreria.interface";
import { EgresoTesoreria } from "../models/egreso-tesoreria.model";
import { BaseCRUDService } from "./base-crud.service";
import { EgresoTesoreriaRubro } from "../models/egreso-tesoreria-rubro.model";

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

            const detallesToCreate = data.egresoTesoreriaRubros?.map(detalle => {
                const { id, ...restoDelDetalle } = detalle;
                return {
                    ...restoDelDetalle,
                    egresoTesoreriaId: nuevoEgreso.id
                };
            });

            await EgresoTesoreriaRubro.bulkCreate(detallesToCreate as any[], { transaction: t });

            return await this.getEgresoById(nuevoEgreso.id ?? 0, t);
        });
    }

    public async updateEgreso(data: IEgresoTesoreria): Promise<EgresoTesoreria> {
        return await sequelize.transaction(async (t) => {
            const egreso = await this.ModelClass.findByPk(data.id, { transaction: t });
            if (!egreso) throw new Error('EGRESO_NO_ENCONTRADO');

            await egreso.update({
                descripcion: data.descripcion,
                beneficiarioCedula: data.beneficiarioCedula,
                beneficiarioNombre: data.beneficiarioNombre,
                cajaBancoId: data.cajaBancoId,
                divisaId: data.divisaId,
                cambio: data.cambio,
                valor: data.valor,
                cajaCierreId: data.cajaCierreId,
                nota: data.nota,
            }, { transaction: t });

            await EgresoTesoreriaRubro.destroy({
                where: { egresoTesoreriaId: data.id },
                transaction: t
            });

            const nuevosDetalles = data.egresoTesoreriaRubros?.map(detalle => {
                const { id, ...restoDelDetalle } = detalle;
                return {
                    ...restoDelDetalle,
                    egresoTesoreriaId: data.id
                };
            });

            await EgresoTesoreriaRubro.bulkCreate(nuevosDetalles as any[], { transaction: t });

            return await this.getEgresoById(data.id ?? 0, t);
        });
    }
}