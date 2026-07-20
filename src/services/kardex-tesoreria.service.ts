import { Transaction } from "sequelize";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { IKardexTesoreria } from "../interfaces/kardex-tesoreria.interface";
import { KardexTesoreria } from "../models/kardex-tesoreria.model";

type KardexTesoreriaCreationData = Omit<IKardexTesoreria, 'id'>;

export class KardexTesoreriaService extends BaseCRUDService<KardexTesoreria> {
    constructor() {
        super(KardexTesoreria);
    }

    public async createKardex(data: KardexTesoreriaCreationData): Promise<KardexTesoreria> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const newKardex = await this.ModelClass.create(data, { transaction });
            await transaction.commit();
            return newKardex;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}