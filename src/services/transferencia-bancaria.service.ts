import sequelize from "../config/db";
import { BaseCRUDService } from "./base-crud.service";
import { ITransferenciaBancaria } from "../interfaces/transferencia-bancaria.interface";
import { TransferenciaBancaria } from "../models/transferencia-bancaria.moldel";
import { Transaction } from "sequelize";

type ICreationData = Omit<ITransferenciaBancaria, 'id' | 'anulado'>;

export class TransferenciaBancariaService extends BaseCRUDService<TransferenciaBancaria> {
    constructor() {
        super(TransferenciaBancaria);
    }

    public async createTransferencia(data: ICreationData, parentTransaction?: Transaction): Promise<TransferenciaBancaria> {
        const executeLogic = async (t: Transaction): Promise<TransferenciaBancaria> => {
            const newTransferencia = await this.ModelClass.create(data, { transaction: t });
            return newTransferencia;
        };

        if (parentTransaction) {
            return await executeLogic(parentTransaction);
        } else {
            return await sequelize.transaction(async (t) => {
                return await executeLogic(t);
            });
        }
    }
}