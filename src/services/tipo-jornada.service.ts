import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { BaseCRUDService } from './base-crud.service';
import { ITipoJornada } from '../interfaces/tipo-jornada.interface';
import { TipoJornada } from '../models/TipoJornada.model';

type TipoJornadaCreationData = Omit<ITipoJornada, 'idTipoJornada' | 'estado'>;

export class TipoJornadaService extends BaseCRUDService<TipoJornada> {
    constructor() {
        super(TipoJornada);
    }

    public async createTipoJornada(tipoJornadaData: TipoJornadaCreationData): Promise<TipoJornada> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { nombre: tipoJornadaData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            tipoJornadaData.codigo = await generarCodigo('tipos_jornada', transaction);
            const newTipoJornada = await this.ModelClass.create(tipoJornadaData, { transaction });
            await transaction.commit();
            return newTipoJornada;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateTipoJornada(tipoJornadaData: ITipoJornada): Promise<TipoJornada> {
        const tipoJornadaToUpdate = await this.ModelClass.findByPk(tipoJornadaData.idTipoJornada);
        if (!tipoJornadaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

        if (tipoJornadaData.nombre.toLocaleUpperCase() !== tipoJornadaToUpdate.nombre.toLocaleUpperCase()) {
            const nameExist = await this.ModelClass.findOne({
                where: { nombre: tipoJornadaData.nombre }
            });

            if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
        }

        tipoJornadaToUpdate.codigo = tipoJornadaData.codigo;
        tipoJornadaToUpdate.nombre = tipoJornadaData.nombre;
        tipoJornadaToUpdate.horas = tipoJornadaData.horas;
        const updatedTipoJornada = await tipoJornadaToUpdate.save();

        return updatedTipoJornada;
    }

    public async updateTipoJornadaStatus(id: number | string): Promise<TipoJornada> {
        const tipoJornada = await this.ModelClass.findByPk(id);
        if (!tipoJornada) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (tipoJornada.estado) {
            newStatus = false;
        }

        tipoJornada.estado = newStatus;
        const updatedTipoJornada = await tipoJornada.save();

        return updatedTipoJornada;
    }
}