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
            // 1. Buscar la divisa a actualizar
            const DivisaToUpdate = await this.ModelClass.findByPk(divisaData.id, { transaction });
            if (!DivisaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

            // 2. Validación de nombre duplicado
            if (divisaData.nombre.toLocaleUpperCase() !== DivisaToUpdate.nombre.toLocaleUpperCase()) {
                const nameExist = await this.ModelClass.findOne({
                    where: { nombre: divisaData.nombre },
                    transaction
                });
                if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
            }

            // 3. Actualizar los campos de la cabecera
            DivisaToUpdate.codigo = divisaData.codigo;
            DivisaToUpdate.nombre = divisaData.nombre;
            DivisaToUpdate.simbolo = divisaData.simbolo;
            DivisaToUpdate.cambio = divisaData.cambio;
            DivisaToUpdate.divisaBase = divisaData.divisaBase;
            await DivisaToUpdate.save({ transaction });

            // 4. Sincronización del detalle (Denominaciones) sin destruir
            if (divisaData.divisaDenominaciones) {
                
                // Paso A: Anular lógicamente todas las denominaciones actuales de esta divisa
                await DivisaDenominacion.update(
                    { anulado: true },
                    { 
                        where: { divisaId: DivisaToUpdate.id }, 
                        transaction 
                    }
                );

                const denominacionesParaCrear: any[] = [];

                for (const denom of divisaData.divisaDenominaciones) {
                    if (denom.id) {
                        // Paso B: Si tiene un ID válido, actualizamos sus campos y lo des-anulamos (anulado: false)
                        await DivisaDenominacion.update(
                            {
                                tipo: denom.tipo,
                                descripcion: denom.descripcion,
                                valor: denom.valor,
                                anulado: false // 👈 Vuelve a estar activo
                            },
                            { 
                                where: { id: denom.id, divisaId: DivisaToUpdate.id }, 
                                transaction 
                            }
                        );
                    } else {
                        // Paso C: Si no tiene ID, lo preparamos para la inserción masiva
                        // Omitimos el id para que la base de datos genere uno autoincremental limpio
                        const { id, ...restoDenominacion } = denom;
                        denominacionesParaCrear.push({
                            ...restoDenominacion,
                            divisaId: DivisaToUpdate.id,
                            anulado: false // Se crea activo por defecto
                        });
                    }
                }

                // Paso D: Insertar de golpe las denominaciones totalmente nuevas
                if (denominacionesParaCrear.length > 0) {
                    await DivisaDenominacion.bulkCreate(denominacionesParaCrear, { transaction });
                }
            }

            await transaction.commit();
            
            // Retornamos la divisa actualizada (puedes incluir el detalle si lo requieres con un findByPk)
            return DivisaToUpdate;

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