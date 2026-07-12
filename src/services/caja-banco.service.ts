import { Transaction } from "sequelize";
import { ICajaBanco } from "../interfaces/caja-banco.interface";
import { CajaBanco } from "../models/caja-banco.model";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";

type CajaBancoCreationData = Omit<ICajaBanco, 'id' | 'anulado'>;

export class CajaBancoService extends BaseCRUDService<CajaBanco> {
    constructor() {
        super(CajaBanco);
    }

    public async createCajaBanco(cajaBancoData: CajaBancoCreationData): Promise<CajaBanco> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { nombre: cajaBancoData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            const newCajaBanco = await this.ModelClass.create(cajaBancoData, { transaction });
            await transaction.commit();
            return newCajaBanco;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateCajaBanco(cajaBancoData: ICajaBanco): Promise<CajaBanco> {
        const cajaBancoToUpdate = await this.ModelClass.findByPk(cajaBancoData.id);
        if (!cajaBancoToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');
        
        if (cajaBancoData.nombre.toLocaleUpperCase() !== cajaBancoToUpdate.nombre.toLocaleUpperCase()) {
            const nameExist = await this.ModelClass.findOne({ 
                where: { nombre: cajaBancoData.nombre } 
            });
            
            if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
        }

        cajaBancoToUpdate.codigo = cajaBancoData.codigo;
        cajaBancoToUpdate.nombre = cajaBancoData.nombre;
        cajaBancoToUpdate.numeroCuenta = cajaBancoData.numeroCuenta;
        cajaBancoToUpdate.clase = cajaBancoData.clase;
        cajaBancoToUpdate.controlaApertura = cajaBancoData.controlaApertura;                        
        const updatedCajaBanco = await cajaBancoToUpdate.save();

        return updatedCajaBanco;
    }

    public async updateCajaBancoStatus(id: number | string): Promise<CajaBanco> {
        const cajaBanco = await this.ModelClass.findByPk(id);
        if (!cajaBanco) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (cajaBanco.anulado) newStatus = false;
        
        cajaBanco.anulado = newStatus;
        const updatedCajaBanco = await cajaBanco.save();

        return updatedCajaBanco;
    }
}