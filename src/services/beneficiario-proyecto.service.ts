import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { BaseCRUDService } from './base-crud.service';
import { IBeneficiarioProyecto } from '../interfaces/beneficiario-proyecto.interface';
import { BeneficiarioProyecto } from '../models/beneficiario-proyecto.model';

type CreationData = Omit<IBeneficiarioProyecto, 'id' | 'anulado'>;

export class BeneficiarioProyectoService extends BaseCRUDService<BeneficiarioProyecto> {
    constructor() {
        super(BeneficiarioProyecto);
    }

    public async createBeneficiarioProyecto(data: CreationData): Promise<BeneficiarioProyecto> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { identificacion: data.identificacion },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            data.codigo = await generarCodigo('beneficiariosProyecto', transaction);
            const newBeneficiarioProyecto = await this.ModelClass.create(data, { transaction });
            await transaction.commit();
            return newBeneficiarioProyecto;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateBeneficiarioProyecto(data: IBeneficiarioProyecto): Promise<BeneficiarioProyecto> {
        const entityToUpdate = await this.ModelClass.findByPk(data.id);
        if (!entityToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

        if (data.identificacion.trim() !== entityToUpdate.identificacion.trim()) {
            const exist = await this.ModelClass.findOne({
                where: { identificacion: data.identificacion }
            });

            if (exist) throw new Error('COINCIDENCIA_ENTIDAD');
        }

        entityToUpdate.esExtranjero = data.esExtranjero;
        entityToUpdate.identificacion = data.identificacion;
        entityToUpdate.nombres = data.nombres;
        entityToUpdate.apellidos = data.apellidos;
        entityToUpdate.sexo = data.sexo;
        entityToUpdate.fechaNacimiento = data.fechaNacimiento;
        entityToUpdate.estadoCivilId = data.estadoCivilId;
        entityToUpdate.ocupacion = data.ocupacion;
        entityToUpdate.autoidentificacionEtnicaId = data.autoidentificacionEtnicaId;
        entityToUpdate.esDiscapacitado = data.esDiscapacitado;
        const updatedEntity = await entityToUpdate.save();

        return updatedEntity;
    }

    public async updateBeneficiarioProyectoStatus(id: number | string): Promise<BeneficiarioProyecto> {
        const entity = await this.ModelClass.findByPk(id);
        if (!entity) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (entity.anulado) newStatus = false;

        entity.anulado = newStatus;
        const updatedEntity = await entity.save();

        return updatedEntity;
    }
}