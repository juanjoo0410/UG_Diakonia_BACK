import { Transaction } from "sequelize";
import sequelize from "../config/db";
import { IRubroTesoreria } from "../interfaces/rubro-tesoreria.interface";
import { RubroTesoreria } from "../models/rubro-tesoreria.model";
import { BaseCRUDService } from "./base-crud.service";

type RubroTesoreriaCreationData = Omit<IRubroTesoreria, 'id' | 'anulado'>;

export class RubroTesoreriaService extends BaseCRUDService<RubroTesoreria> {
    constructor() {
        super(RubroTesoreria);
    }

    public async createRubroTesoreria(RubroTesoreriaData: RubroTesoreriaCreationData): Promise<RubroTesoreria> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { nombre: RubroTesoreriaData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            const newRubroTesoreria = await this.ModelClass.create(RubroTesoreriaData, { transaction });
            await transaction.commit();
            return newRubroTesoreria;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateRubroTesoreria(RubroTesoreriaData: IRubroTesoreria): Promise<RubroTesoreria> {
        const RubroTesoreriaToUpdate = await this.ModelClass.findByPk(RubroTesoreriaData.id);
        if (!RubroTesoreriaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');
        
        if (RubroTesoreriaData.nombre.toLocaleUpperCase() !== RubroTesoreriaToUpdate.nombre.toLocaleUpperCase()) {
            const nameExist = await this.ModelClass.findOne({ 
                where: { nombre: RubroTesoreriaData.nombre } 
            });
            
            if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
        }

        RubroTesoreriaToUpdate.codigo = RubroTesoreriaData.codigo;
        RubroTesoreriaToUpdate.nombre = RubroTesoreriaData.nombre;
        RubroTesoreriaToUpdate.tipo = RubroTesoreriaData.tipo;                       
        const updatedRubroTesoreria = await RubroTesoreriaToUpdate.save();

        return updatedRubroTesoreria;
    }

    public async updateRubroTesoreriaStatus(id: number | string): Promise<RubroTesoreria> {
        const RubroTesoreria = await this.ModelClass.findByPk(id);
        if (!RubroTesoreria) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (RubroTesoreria.anulado) newStatus = false;
        
        RubroTesoreria.anulado = newStatus;
        const updatedRubroTesoreria = await RubroTesoreria.save();

        return updatedRubroTesoreria;
    }
}