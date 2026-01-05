import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { IArea } from '../interfaces/area.interface';
import { Area } from '../models/Area.model';
import { BaseCRUDService } from './base-crud.service';

type AreaCreationData = Omit<IArea, 'idArea' | 'estado'>;

export class AreaService extends BaseCRUDService<Area> {
    constructor() {
        super(Area);
    }

    public async createArea(areaData: AreaCreationData): Promise<Area> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { nombre: areaData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            areaData.codigo = await generarCodigo('areas', transaction);
            const newArea = await this.ModelClass.create(areaData, { transaction });
            await transaction.commit();
            return newArea;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateArea(areaData: IArea): Promise<Area> {
        const areaToUpdate = await this.ModelClass.findByPk(areaData.idArea);
        if (!areaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');
        
        if (areaData.nombre.toLocaleUpperCase() !== areaToUpdate.nombre.toLocaleUpperCase()) {
            const nameExist = await this.ModelClass.findOne({ 
                where: { nombre: areaData.nombre } 
            });
            
            if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
        }

        areaToUpdate.codigo = areaData.codigo;
        areaToUpdate.nombre = areaData.nombre;
        const updatedArea = await areaToUpdate.save();

        return updatedArea;
    }

    public async updateAreaStatus(id: number | string): Promise<Area> {
        const area = await this.ModelClass.findByPk(id);
        if (!area) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (area.estado) newStatus = false;
        
        area.estado = newStatus;
        const updatedArea = await area.save();

        return updatedArea;
    }
}