import { IApertura } from "../interfaces/apertura.interface";
import { Apertura } from "../models/apertura.model";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";

type AperturaCreationData = Omit<IApertura, 'id'>;

export class AperturaService extends BaseCRUDService<Apertura> {
    constructor() {
        super(Apertura);
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
                aperturaExistente.cerradaPor = aperturaData.cerradaPor;
                aperturaExistente.cerradaFecha = aperturaData.cerradaFecha;
                aperturaExistente.ingresoTesoreriaId = aperturaData.ingresoTesoreriaId;
                aperturaExistente.faltante = aperturaData.faltante;
                aperturaExistente.sobrante = aperturaData.sobrante;

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