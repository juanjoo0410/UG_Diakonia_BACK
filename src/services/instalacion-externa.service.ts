import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { BaseCRUDService } from './base-crud.service';
import { IInstalacionExterna } from '../interfaces/instalacion-externa.interface';
import { InstalacionExterna } from '../models/InstalacionExterna.model';

type InstalacionExternaCreationData = Omit<IInstalacionExterna, 'idInstalacionExterna' | 'estado'>;

export class InstalacionExternaService extends BaseCRUDService<InstalacionExterna> {
    constructor() {
        super(InstalacionExterna);
    }

    public async createInstalacionExterna(instalacionExternaData: InstalacionExternaCreationData): Promise<InstalacionExterna> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { nombre: instalacionExternaData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            instalacionExternaData.codigo = await generarCodigo('instalacion-externa', transaction);
            const newInstalacionExterna = await this.ModelClass.create(instalacionExternaData, { transaction });
            await transaction.commit();
            return newInstalacionExterna;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateInstalacionExterna(instalacionExternaData: IInstalacionExterna): Promise<InstalacionExterna> {
        const instalacionExternaToUpdate = await this.ModelClass.findByPk(instalacionExternaData.idInstalacionExterna);
        if (!instalacionExternaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');
        
        if (instalacionExternaData.nombre.toLocaleUpperCase() !== instalacionExternaToUpdate.nombre.toLocaleUpperCase()) {
            const nameExist = await this.ModelClass.findOne({ 
                where: { nombre: instalacionExternaData.nombre } 
            });
            
            if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
        }

        instalacionExternaToUpdate.codigo = instalacionExternaData.codigo;
        instalacionExternaToUpdate.nombre = instalacionExternaData.nombre;
        const updatedInstalacionExterna = await instalacionExternaToUpdate.save();

        return updatedInstalacionExterna;
    }

    public async updateInstalacionExternaStatus(id: number | string): Promise<InstalacionExterna> {
        const instalacionExterna = await this.ModelClass.findByPk(id);
        if (!instalacionExterna) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (instalacionExterna.estado) newStatus = false;
        
        instalacionExterna.estado = newStatus;
        const updatedInstalacionExterna = await instalacionExterna.save();

        return updatedInstalacionExterna;
    }
}