import sequelize from '../config/db';
import { col, fn, Transaction, where, Op, literal } from 'sequelize';
import { IAsistenciaVoluntario } from '../interfaces/asistencia-voluntario.interface';
import { AsistenciaVoluntario } from '../models/AsistenciaVoluntario.model';
import { BaseCRUDService } from './base-crud.service';
import { FilterDto } from '../dtos/filter.dto';
import { Institucion } from '../models/institucionModel';
import { Voluntario } from '../models/Voluntario.model';
import { TipoJornada } from '../models/TipoJornada.model';
import { InstalacionExterna } from '../models/InstalacionExterna.model';
import { Area } from '../models/Area.model';
import { getNumeroSemana, limpiarTildes, normalizarFecha } from '../utils/utilsService';

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

    public async updateAsistenciaVoluntario(asistenciaVoluntarioData: IAsistenciaVoluntario): Promise<AsistenciaVoluntario> {
        const asistenciaToUpdate = await this.ModelClass.findByPk(asistenciaVoluntarioData.idAsistenciaVoluntario);
        if (!asistenciaToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

        asistenciaToUpdate.idInstitucion = asistenciaVoluntarioData.idInstitucion;
        asistenciaToUpdate.familia = asistenciaVoluntarioData.familia;
        asistenciaToUpdate.voluntarioEducativo = asistenciaVoluntarioData.voluntarioEducativo;
        asistenciaToUpdate.voluntarioCorporativo = asistenciaVoluntarioData.voluntarioCorporativo;
        asistenciaToUpdate.idTipoJornada = asistenciaVoluntarioData.idTipoJornada;
        asistenciaToUpdate.recibeKit = asistenciaVoluntarioData.recibeKit;
        asistenciaToUpdate.recibeAlimentacion = asistenciaVoluntarioData.recibeAlimentacion;
        asistenciaToUpdate.estatus = asistenciaVoluntarioData.estatus;
        asistenciaToUpdate.idInstalacionExterna = asistenciaVoluntarioData.idInstalacionExterna;
        asistenciaToUpdate.observacion1 = asistenciaVoluntarioData.observacion1;
        asistenciaToUpdate.observacion2 = asistenciaVoluntarioData.observacion2;
        asistenciaToUpdate.idArea = asistenciaVoluntarioData.idArea;
        const updatedVoluntario = await asistenciaToUpdate.save();

        return updatedVoluntario;
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
                order: [['fecha', 'DESC']],
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

    public async getUltimaFechaAsistencia(): Promise<string | null> {
        try {
            const ultimaAsistencia = await this.ModelClass.findOne({
                attributes: ['fecha'],
                order: [['fecha', 'DESC']],
                raw: true // Para obtener solo el objeto plano sin métodos de instancia
            });

            if (!ultimaAsistencia) return null;

            // Convertimos a objeto Date y formateamos manualmente a dd/mm/yyyy
            const d = new Date(ultimaAsistencia.fecha);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Enero es 0
            const year = d.getFullYear();

            return `${day}/${month}/${year}`;
        } catch (error) {
            throw new Error(`Error al obtener la última fecha: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async getResumenHorasPorJornada(semana: number, anio: number): Promise<any[]> {
        try {
            const whereConditions: any = {
                estatus: 'GENERADO',
                [Op.and]: [
                    where(fn('YEAR', col('fecha')), anio)
                ]
            };
            if (semana !== 0) { whereConditions.semana = semana; }

            const resumen = await this.ModelClass.findAll({
                attributes: [
                    [col('tipoJornada.nombre'), 'jornada'],
                    [fn('SUM', col('tipoJornada.horas')), 'totalHoras']
                ],
                where: whereConditions,
                include: [{
                    model: TipoJornada,
                    as: 'tipoJornada',
                    attributes: []
                }],
                group: [col('tipoJornada.nombre')],
                order: [[col('tipoJornada.nombre'), 'ASC']],
                raw: true
            });

            return resumen;
        } catch (error) {
            throw new Error(`Error en resumen de horas: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async getResumenVoluntarios(semana: number, anio: number): Promise<any[]> {
        try {
            const whereConditions: any = {
                estatus: 'GENERADO',
                [Op.and]: [
                    where(fn('YEAR', col('fecha')), anio)
                ]
            };
            if (semana !== 0) { whereConditions.semana = semana; }

            const resumen = await this.ModelClass.findAll({
                attributes: [
                    [fn('COUNT', fn('DISTINCT', col('AsistenciaVoluntario.idVoluntario'))), 'totalGeneral'],
                    [
                        literal(`COUNT(DISTINCT CASE WHEN voluntario.sexo = 'M' THEN AsistenciaVoluntario.idVoluntario END)`),
                        'totalHombres'
                    ],
                    [
                        literal(`COUNT(DISTINCT CASE WHEN voluntario.sexo = 'F' THEN AsistenciaVoluntario.idVoluntario END)`),
                        'totalMujeres'
                    ]
                ],
                where: whereConditions,
                include: [{
                    model: Voluntario,
                    as: 'voluntario',
                    attributes: []
                }],
                raw: true
            });

            return resumen;
        } catch (error) {
            throw new Error(`Error en resumen de voluntarios: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async getResumenInstituciones(semana: number, anio: number): Promise<any[]> {
        try {
            const whereConditions: any = {
                idInstitucion: { [Op.ne]: null },
                estatus: 'GENERADO',
                [Op.and]: [
                    where(fn('YEAR', col('fecha')), anio)
                ]
            };
            if (semana !== 0) { whereConditions.semana = semana; }

            const resumen = await this.ModelClass.findAll({
                attributes: [
                    [fn('COUNT', fn('DISTINCT', col('AsistenciaVoluntario.idInstitucion'))), 'totalInstituciones']
                ],
                where: whereConditions,
                raw: true
            });

            return resumen;
        } catch (error) {
            throw new Error(`Error en resumen de instituciones: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async getResumenLugares(mes: number, anio: number): Promise<any[]> {
        try {

            const whereConditions: any = {
                estatus: 'GENERADO',
                [Op.and]: [where(fn('YEAR', col('AsistenciaVoluntario.fecha')), anio)]
            };

            if (mes !== 0) {
                whereConditions[Op.and].push(
                    where(fn('MONTH', col('AsistenciaVoluntario.fecha')), mes)
                );
            }

            const resumen = await this.ModelClass.findAll({
                attributes: [
                    [col('instalacionExterna.nombre'), 'lugar'],
                    [
                        literal(`COUNT(CASE WHEN voluntario.sexo = 'M' THEN AsistenciaVoluntario.idInstalacionExterna END)`),
                        'totalHombres'
                    ],
                    [
                        literal(`COUNT(CASE WHEN voluntario.sexo = 'F' THEN AsistenciaVoluntario.idInstalacionExterna END)`),
                        'totalMujeres'
                    ],
                    [
                        fn('COUNT', col('AsistenciaVoluntario.idInstalacionExterna')),
                        'total'
                    ]
                ],
                where: whereConditions,
                include: [
                    {
                        model: Voluntario,
                        as: 'voluntario',
                        attributes: [] // Solo para el JOIN
                    },
                    {
                        model: InstalacionExterna,
                        as: 'instalacionExterna',
                        attributes: [] // Solo para el JOIN
                    }
                ],
                group: [col('instalacionExterna.nombre')],
                order: [[col('instalacionExterna.nombre'), 'ASC']],
                raw: true
            });

            return resumen;
        } catch (error) {
            throw new Error(`Error en resumen de lugares: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async importAsistenciasJson(lista: any[]): Promise<any> {
        const transaction = await sequelize.transaction();

        try {
            const [instituciones] = await Promise.all([Institucion.findAll({ where: { estado: true } })]);
            const [voluntarios] = await Promise.all([Voluntario.findAll({ where: { estado: true } })]);
            const [tiposJornadas] = await Promise.all([TipoJornada.findAll({ where: { estado: true } })]);
            const [instalaciones] = await Promise.all([InstalacionExterna.findAll({ where: { estado: true } })]);
            const [areas] = await Promise.all([Area.findAll({ where: { estado: true } })]);

            const mapInstitucion = new Map(instituciones.map(t => [limpiarTildes(t.nombre), t.idInstitucion]));
            const mapVoluntario = new Map(voluntarios.map(t => [t.identificacion, t.idVoluntario]));
            const mapTipoJornada = new Map(tiposJornadas.map(t => [limpiarTildes(t.nombre), t.idTipoJornada]));
            const mapInstalacion = new Map(instalaciones.map(t => [limpiarTildes(t.nombre), t.idInstalacionExterna]));
            const mapArea = new Map(areas.map(t => [limpiarTildes(t.nombre), t.idArea]));

            let count = 0;

            for (const row of lista) {
                count += 1;
                const fecha = normalizarFecha(row.fecha);
                const semana = getNumeroSemana(fecha.toDateString());
                const identificacion = String(row.identificacion || '').trim();

                let institucion = row.solicitadoA?.toUpperCase().trim() ?? '';
                let idInstitucion: number = 0;
                let familia: boolean = institucion === 'FAMILIA' ? true : false;
                let educativo: boolean = institucion === 'VOLUNTARIO EDUCATIVO' ? true : false;
                let corporativo: boolean = institucion === 'VOLUNTARIO CORPORATIVO' ? true : false;
                if (institucion !== 'FAMILIA' || institucion !== 'VOLUNTARIO EDUCATIVO' || institucion !== 'VOLUNTARIO CORPORATIVO') {
                    const searchId = mapInstitucion.get(limpiarTildes(row.solicitadoA));
                    if (!searchId) throw new Error(`TIPO_JORNADA_INVALID:${row.tipoJornada}`);
                    idInstitucion = searchId;
                }

                const idVoluntario = mapVoluntario.get(identificacion);
                if (!idVoluntario) throw new Error(`VOLUNTARIO_INVALID: ${identificacion} FILA:${count}`);

                const idTipoJornada = mapTipoJornada.get(limpiarTildes(row.tipoJornada));
                if (!idTipoJornada) throw new Error(`TIPO_JORNADA_INVALID: ${row.tipoJornada} FILA:${count}`);

                const idInstalacionExterna = mapInstalacion.get(limpiarTildes(row.lugar));
                if (!idInstalacionExterna) throw new Error(`INSTALACION_INVALID: ${row.lugar} FILA:${count}`);

                const idArea = mapArea.get(limpiarTildes(row.area));
                if (!idArea) throw new Error(`AREA_INVALID: ${row.area} FILA:${count}`);

                await AsistenciaVoluntario.create({
                    semana,
                    fecha,
                    idInstitucion: idInstitucion === 0 ? undefined : idInstitucion,
                    familia,
                    voluntarioEducativo: educativo,
                    voluntarioCorporativo: corporativo,
                    idVoluntario,
                    idTipoJornada,
                    recibeKit: row.recibeKit?.trim().toUpperCase() == 'SI' ? true : false,
                    recibeAlimentacion: row.recibeAlimentacion?.trim().toUpperCase() == 'SI' ? true : false,
                    estatus: row.estatus?.toUpperCase().trim() ?? 'NO GENERADO',
                    idInstalacionExterna,
                    observacion1: row.observacion1?.toUpperCase().trim() ?? '',
                    observacion2: row.observacion2?.toUpperCase().trim() ?? '',
                    idArea
                }, { transaction });
            }

            await transaction.commit();
            return { status: true, message: 'Proceso finalizado' };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
}