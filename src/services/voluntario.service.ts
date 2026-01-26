import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { BaseCRUDService } from './base-crud.service';
import { IVoluntario } from '../interfaces/voluntario.interface';
import { Voluntario } from '../models/Voluntario.model';

type VoluntarioCreationData = Omit<IVoluntario, 'idVoluntario' | 'estado'>;

export class VoluntarioService extends BaseCRUDService<Voluntario> {
    constructor() {
        super(Voluntario);
    }

    public async createVoluntario(voluntarioData: VoluntarioCreationData): Promise<Voluntario> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { identificacion: voluntarioData.identificacion },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            voluntarioData.codigo = await generarCodigo('voluntarios', transaction);
            const newVoluntario = await this.ModelClass.create(voluntarioData, { transaction });
            await transaction.commit();
            return newVoluntario;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateVoluntario(voluntarioData: IVoluntario): Promise<Voluntario> {
        const voluntarioToUpdate = await this.ModelClass.findByPk(voluntarioData.idVoluntario);
        if (!voluntarioToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

        if (voluntarioData.identificacion.trim() !== voluntarioToUpdate.identificacion.trim()) {
            const exist = await this.ModelClass.findOne({
                where: { identificacion: voluntarioData.identificacion }
            });

            if (exist) throw new Error('COINCIDENCIA_ENTIDAD');
        }

        voluntarioToUpdate.codigo = voluntarioData.codigo;
        voluntarioToUpdate.identificacion = voluntarioData.identificacion;
        voluntarioToUpdate.nombre = voluntarioData.nombre;
        voluntarioToUpdate.sexo = voluntarioData.sexo;
        voluntarioToUpdate.idTipoJornada = voluntarioData.idTipoJornada;
        voluntarioToUpdate.recibeKit = voluntarioData.recibeKit;
        const updatedVoluntario = await voluntarioToUpdate.save();

        return updatedVoluntario;
    }

    public async updateVoluntarioStatus(id: number | string): Promise<Voluntario> {
        const voluntario = await this.ModelClass.findByPk(id);
        if (!voluntario) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (voluntario.estado) newStatus = false;

        voluntario.estado = newStatus;
        const updatedVoluntario = await voluntario.save();

        return updatedVoluntario;
    }
}