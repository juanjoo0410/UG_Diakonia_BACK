import { Op, Transaction } from "sequelize";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { IEmpresaPatrocinadora } from "../interfaces/empresa-patrocinadora.interface";
import { IEmpresaPatrocinadoraBeneficiario } from "../interfaces/empresa-patrocinadora-beneficiario.interface";
import { EmpresaPatrocinadora } from "../models/empresa-patrocinadora.model";
import { EmpresaPatrocinadoraBeneficiario } from "../models/empresa-patrocinadora-beneficiario.model";

type EmpresaPatrocinadoraCreationData = Omit<IEmpresaPatrocinadora, 'id' | 'anulado'>;

export class EmpresaPatrocinadoraService extends BaseCRUDService<EmpresaPatrocinadora> {
    constructor() {
        super(EmpresaPatrocinadora);
    }

    public async createEmpresaPatrocinadora(
        empresaPatrocinadoraData: EmpresaPatrocinadoraCreationData): Promise<EmpresaPatrocinadora> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: {
                    codigo: empresaPatrocinadoraData.codigo,
                    nombre: empresaPatrocinadoraData.nombre
                },
                transaction: transaction,
            });
            if (checkIs) throw new Error('ENTIDAD_EXISTE');

            const checkRuc = await this.ModelClass.findOne({
                where: { ruc: empresaPatrocinadoraData.ruc },
                transaction: transaction,
            });
            if (checkRuc) throw new Error('RUC_EXISTE');

            const newEmpresaPatrocinadora = await this.ModelClass.create(empresaPatrocinadoraData, { transaction });

            if (empresaPatrocinadoraData.beneficiarios && empresaPatrocinadoraData.beneficiarios.length > 0) {
                const beneficiarios = empresaPatrocinadoraData.beneficiarios.map(u => ({
                    empresaPatrocinadoraId: newEmpresaPatrocinadora.id,
                    beneficiarioId: u.beneficiarioId,
                }));

                await EmpresaPatrocinadoraBeneficiario.bulkCreate(beneficiarios as any[], { transaction });
            }

            await transaction.commit();
            return newEmpresaPatrocinadora;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateEmpresaPatrocinadora(
        empresaPatrocinadoraData: IEmpresaPatrocinadora): Promise<EmpresaPatrocinadora> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const empresaPatrocinadoraToUpdate = await this.ModelClass.findByPk(empresaPatrocinadoraData.id, { transaction });
            if (!empresaPatrocinadoraToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

            if (empresaPatrocinadoraData.nombre.toLocaleUpperCase() !== empresaPatrocinadoraToUpdate.nombre.toLocaleUpperCase()) {
                const nameExist = await this.ModelClass.findOne({
                    where: { nombre: empresaPatrocinadoraData.nombre },
                    transaction
                });
                if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
            }

            if (empresaPatrocinadoraData.ruc !== empresaPatrocinadoraToUpdate.ruc) {
                const rucExist = await this.ModelClass.findOne({
                    where: { ruc: empresaPatrocinadoraData.ruc },
                    transaction
                });
                if (rucExist) throw new Error('RUC_EXISTE');
            }

            empresaPatrocinadoraToUpdate.codigo = empresaPatrocinadoraData.codigo;
            empresaPatrocinadoraToUpdate.nombre = empresaPatrocinadoraData.nombre;
            empresaPatrocinadoraToUpdate.ruc = empresaPatrocinadoraData.ruc;
            await empresaPatrocinadoraToUpdate.save({ transaction });

            if (empresaPatrocinadoraData.beneficiarios) {
                const patrocinadoraId = empresaPatrocinadoraToUpdate.id ?? 0;
                const beneficiariosInput = empresaPatrocinadoraData.beneficiarios;

                await EmpresaPatrocinadoraBeneficiario.update(
                    { anulado: true },
                    {
                        where: { empresaPatrocinadoraId: patrocinadoraId },
                        transaction
                    }
                );

                if (beneficiariosInput.length > 0) {
                    const idsIngresados = beneficiariosInput.map(b => b.beneficiarioId);

                    const existentes = await EmpresaPatrocinadoraBeneficiario.findAll({
                        where: {
                            empresaPatrocinadoraId: patrocinadoraId,
                            beneficiarioId: { [Op.in]: idsIngresados }
                        },
                        attributes: ['beneficiarioId'],
                        transaction
                    });

                    const setExistentesIds = new Set(existentes.map(e => e.beneficiarioId));

                    if (setExistentesIds.size > 0) {
                        await EmpresaPatrocinadoraBeneficiario.update(
                            { anulado: false },
                            {
                                where: {
                                    empresaPatrocinadoraId: patrocinadoraId,
                                    beneficiarioId: { [Op.in]: Array.from(setExistentesIds) }
                                },
                                transaction
                            }
                        );
                    }

                    const nuevosBeneficiarios: IEmpresaPatrocinadoraBeneficiario[] = beneficiariosInput
                        .filter(row => !setExistentesIds.has(row.beneficiarioId))
                        .map(({ id, ...restoBeneficiario }) => ({
                            ...restoBeneficiario,
                            empresaPatrocinadoraId: patrocinadoraId,
                            anulado: false
                        }));

                    if (nuevosBeneficiarios.length > 0) {
                        await EmpresaPatrocinadoraBeneficiario.bulkCreate(nuevosBeneficiarios as any[], { transaction });
                    }
                }
            }

            await transaction.commit();

            return empresaPatrocinadoraToUpdate;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateEmpresaPatrocinadoraStatus(id: number | string): Promise<EmpresaPatrocinadora> {
        const empresaPatrocinadora = await this.ModelClass.findByPk(id);
        if (!empresaPatrocinadora) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (empresaPatrocinadora.anulado) newStatus = false;

        empresaPatrocinadora.anulado = newStatus;
        const updatedEmpresaPatrocinadora = await empresaPatrocinadora.save();

        return updatedEmpresaPatrocinadora;
    }
}