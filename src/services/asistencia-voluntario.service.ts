import sequelize from '../config/db';
import { col, fn, Transaction, where, Op } from 'sequelize';
import { IAsistenciaVoluntario } from '../interfaces/asistencia-voluntario.interface';
import { AsistenciaVoluntario } from '../models/AsistenciaVoluntario.model';
import { BaseCRUDService } from './base-crud.service';
import { FilterDto } from '../dtos/filter.dto';
import { Institucion } from '../models/institucionModel';
import { Voluntario } from '../models/Voluntario.model';
import { TipoJornada } from '../models/TipoJornada.model';
import { InstalacionExterna } from '../models/InstalacionExterna.model';
import { Area } from '../models/Area.model';

type AsistenciaVoluntarioData = Omit<IAsistenciaVoluntario, 'idAsistenciaVoluntario'>;

export class AsistenciaVoluntarioService extends BaseCRUDService<AsistenciaVoluntario> {
    constructor() {
        super(AsistenciaVoluntario);
    }

    public async createAsistenciaVoluntario(asistenciaVoluntarioData: AsistenciaVoluntarioData): Promise<AsistenciaVoluntario> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const fechaObj = new Date(asistenciaVoluntarioData.fecha);
            const dateAsistencia = fechaObj.toISOString().split('T')[0];

            const checkIs = await this.ModelClass.findOne({
                where: {
                    idVoluntario: asistenciaVoluntarioData.idVoluntario,
                    [Op.and]: [
                        where(fn('date', col('fecha')), {
                            [Op.eq]: dateAsistencia
                        })
                    ]
                },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ASISTENCIA_EXISTE');
            }
            const newAsistenciaVoluntario = await this.ModelClass.create(asistenciaVoluntarioData, { transaction });
            await transaction.commit();
            return newAsistenciaVoluntario;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async getAllAsistenciasByDate(filters: FilterDto): Promise<AsistenciaVoluntario[]> {
        const { fechaInicio, fechaFin } = filters;
        try {
            const asistencias = await this.ModelClass.findAll({
                where: {
                    fecha: {
                        [Op.between]: [fechaInicio, fechaFin],
                    },
                },
                include: [{
                    model: Institucion,
                    as: 'institucion',
                    attributes: ['codigo', 'nombre']
                },
                {
                    model: Voluntario,
                    as: 'voluntario',
                    attributes: ['codigo', 'nombre', 'identificacion', 'sexo']
                },
                {
                    model: TipoJornada,
                    as: 'tipoJornada',
                    attributes: ['codigo', 'nombre']
                },
                {
                    model: InstalacionExterna,
                    as: 'instalacionExterna',
                    attributes: ['codigo', 'nombre']
                },
                {
                    model: Area,
                    as: 'area',
                    attributes: ['codigo', 'nombre']
                }]
            });

            return asistencias;

        } catch (error) {
            throw new Error(`Error en consulta de asistencias: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}