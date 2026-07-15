import { Transaction } from "sequelize";
import { IDivisa } from "../interfaces/divisa.interface";
import { Divisa } from "../models/divisa.model";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { DivisaDenominacion } from "../models/divisa-denominacion.model";

type DivisaCreationData = Omit<IDivisa, 'id' | 'anulado'>;

export class DivisaService extends BaseCRUDService<Divisa> {
    constructor() {
        super(Divisa);
    }

    public async createDivisa(divisaData: DivisaCreationData): Promise<Divisa> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { codigo: divisaData.codigo, nombre: divisaData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            const newDivisa = await this.ModelClass.create(divisaData, { transaction });

            if (divisaData.divisaDenominaciones && divisaData.divisaDenominaciones.length > 0) {
                const denominaciones = divisaData.divisaDenominaciones.map(u => ({
                    divisaId: newDivisa.id,
                    tipo: u.tipo,
                    descripcion: u.descripcion,
                    valor: u.valor
                }));

                await Divisa.bulkCreate(denominaciones as any[], { transaction });
            }

            await transaction.commit();
            return newDivisa;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateDivisa(divisaData: IDivisa): Promise<Divisa> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const divisaToUpdate = await this.ModelClass.findByPk(divisaData.id, { transaction });
            if (!divisaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

            if (divisaData.nombre.toLocaleUpperCase() !== divisaToUpdate.nombre.toLocaleUpperCase()) {
                const nameExist = await this.ModelClass.findOne({
                    where: { nombre: divisaData.nombre },
                    transaction
                });
                if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
            }

            divisaToUpdate.codigo = divisaData.codigo;
            divisaToUpdate.nombre = divisaData.nombre;
            divisaToUpdate.simbolo = divisaData.simbolo;
            divisaToUpdate.cambio = divisaData.cambio;
            divisaToUpdate.divisaBase = divisaData.divisaBase;
            await divisaToUpdate.save({ transaction });

            if (divisaData.divisaDenominaciones) {
                await DivisaDenominacion.update(
                    { anulado: true },
                    {
                        where: { divisaId: divisaToUpdate.id },
                        transaction
                    }
                );

                const denominacionesParaCrear: any[] = [];

                for (const denom of divisaData.divisaDenominaciones) {                    
                    const denominacionExistente = await DivisaDenominacion.findOne({
                        where: {
                            divisaId: divisaToUpdate.id,
                            tipo: denom.tipo,
                            descripcion: denom.descripcion.trim()
                        },
                        transaction
                    });

                    if (denominacionExistente) {
                        await denominacionExistente.update(
                            {
                                valor: denom.valor,
                                anulado: false
                            },
                            { transaction }
                        );
                    } else {
                        const { id, ...restoDenominacion } = denom;
                        denominacionesParaCrear.push({
                            ...restoDenominacion,
                            descripcion: denom.descripcion.trim(),
                            divisaId: divisaToUpdate.id,
                            anulado: false
                        });
                    }
                }

                if (denominacionesParaCrear.length > 0) {
                    await DivisaDenominacion.bulkCreate(denominacionesParaCrear, { transaction });
                }
            }

            await transaction.commit();

            return divisaToUpdate;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateDivisaStatus(id: number | string): Promise<Divisa> {
        const Divisa = await this.ModelClass.findByPk(id);
        if (!Divisa) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (Divisa.anulado) newStatus = false;

        Divisa.anulado = newStatus;
        const updatedDivisa = await Divisa.save();

        return updatedDivisa;
    }
}