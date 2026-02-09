import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { BaseCRUDService } from './base-crud.service';
import { IVoluntario } from '../interfaces/voluntario.interface';
import { Voluntario } from '../models/Voluntario.model';
import { Contador } from '../models/contadorModel';
import { TipoJornada } from '../models/TipoJornada.model';
import { limpiarTildes } from '../utils/utilsService';

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
        voluntarioToUpdate.esExtranjero = voluntarioData.esExtranjero;
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

    public async importVoluntariosJson(lista: any[]): Promise<any> {
        const transaction = await sequelize.transaction();

        try {
            const contadorLocal = await Contador.findOne({
                where: { nombre: 'voluntarios' },
                transaction
            });

            if (!contadorLocal) throw new Error('CONTADOR_NOT_FOUND');

            let siguienteValor = contadorLocal.ultimoValor;

            // Carga de catálogos en paralelo para optimizar
            const [tiposJornadas] = await Promise.all([
                TipoJornada.findAll({ where: { estado: true } })
            ]);

            const mapTipoJornada = new Map(tiposJornadas.map(t => [limpiarTildes(t.nombre), t.idTipoJornada]));

            const idsExcel = lista.map(row => row.identificacion?.toString().trim()).filter(identificacion => identificacion);
            const voluntariosExistentes = await Voluntario.findAll({
                where: { identificacion: idsExcel },
                attributes: ['identificacion'],
                transaction
            });

            const idsExistentesSet = new Set(voluntariosExistentes.map(i => i.identificacion));

            for (const row of lista) {
                let identificacion = String(row.identificacion || '').trim();
                if (idsExistentesSet.has(identificacion)) continue;

                const idTipoJornada = mapTipoJornada.get(limpiarTildes(row.tipoJornada));

                // Validaciones de negocio
                if (!idTipoJornada) throw new Error(`TIPO_JORNADA_INVALID:${row.tipoJornada}`);

                siguienteValor += 1;
                const codigo = `${contadorLocal.prefijo}${siguienteValor.toString().padStart(contadorLocal.numFormato, '0')}`;

                await Voluntario.create({
                    codigo,
                    esExtranjero: row.esExtranjero?.trim().toUpperCase() == 'SI' ? true : false,
                    identificacion,
                    nombre: row.nombre.toUpperCase().trim(),
                    sexo: row.sexo?.trim(),
                    idTipoJornada,
                    recibeKit: row.recibeKit?.trim().toUpperCase() == 'SI' ? true : false,
                    estado: true
                }, { transaction });
            }

            contadorLocal.ultimoValor = siguienteValor;
            await contadorLocal.save({ transaction });

            await transaction.commit();
            return { status: true, message: 'Proceso finalizado' };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
}