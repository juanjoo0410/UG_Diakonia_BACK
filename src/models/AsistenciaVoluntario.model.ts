import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IInstitucion } from '../interfaces/IInstitucion';
import { IVoluntario } from '../interfaces/voluntario.interface';
import { ITipoJornada } from '../interfaces/tipo-jornada.interface';
import { IInstalacionExterna } from '../interfaces/instalacion-externa.interface';
import { IArea } from '../interfaces/area.interface';
import { IAsistenciaVoluntario } from '../interfaces/asistencia-voluntario.interface';
import { Institucion } from './institucionModel';
import { Voluntario } from './Voluntario.model';
import { TipoJornada } from './TipoJornada.model';
import { InstalacionExterna } from './InstalacionExterna.model';
import { Area } from './Area.model';

export class AsistenciaVoluntario extends Model<IAsistenciaVoluntario> implements IAsistenciaVoluntario {
    public idAsistenciaVoluntario?: number;
    public semana!: number;
    public fecha!: Date;
    public idInstitucion?: number;
    public institucion?: IInstitucion | undefined;
    public familia!: boolean;
    public voluntarioEducativo!: boolean;
    public idVoluntario!: number;
    public voluntario?: IVoluntario | undefined;
    public idTipoJornada!: number;
    public tipoJornada?: ITipoJornada | undefined;
    public recibeKit!: boolean;
    public estatus!: string;
    public idInstalacionExterna!: number;
    public instalacionExterna?: IInstalacionExterna | undefined;
    public observacion1!: string;
    public observacion2!: string;
    public idArea!: number;
    public area?: IArea | undefined;
}

AsistenciaVoluntario.init(
    {
        idAsistenciaVoluntario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        semana: { type: DataTypes.INTEGER, allowNull: false },
        fecha: { type: DataTypes.DATE, allowNull: true },
        idInstitucion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'instituciones',
                key: 'idInstitucion'
            }
        },
        familia: { type: DataTypes.BOOLEAN, allowNull: false },
        voluntarioEducativo: { type: DataTypes.BOOLEAN, allowNull: false },
        idVoluntario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'voluntarios',
                key: 'idVoluntario'
            }
        },
        idTipoJornada: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_jornada',
                key: 'idTipoJornada'
            }
        },
        recibeKit: { type: DataTypes.BOOLEAN, allowNull: false },
        estatus: { type: DataTypes.STRING(20), allowNull: false },
        idInstalacionExterna: {
            type: DataTypes.INTEGER,
            references: {
                model: 'instalaciones_externas',
                key: 'idInstalacionExterna'
            }
        },
        observacion1: { type: DataTypes.STRING(150), allowNull: false },
        observacion2: { type: DataTypes.STRING(150), allowNull: false },
        idArea: {
            type: DataTypes.INTEGER,
            references: {
                model: 'areas',
                key: 'idArea'
            }
        },
    },
    {
        sequelize,
        tableName: 'voluntarios_asistencias',
        timestamps: true
    }
);

AsistenciaVoluntario.belongsTo(Institucion, {
    foreignKey: 'idInstitucion',
    as: 'institucion'
});

AsistenciaVoluntario.belongsTo(Voluntario, {
    foreignKey: 'idVoluntario',
    as: 'voluntario'
});

AsistenciaVoluntario.belongsTo(TipoJornada, {
    foreignKey: 'idTipoJornada',
    as: 'tipoJornada'
});

AsistenciaVoluntario.belongsTo(InstalacionExterna, {
    foreignKey: 'idInstalacionExterna',
    as: 'instalacionExterna'
});

AsistenciaVoluntario.belongsTo(Area, {
    foreignKey: 'idArea',
    as: 'area'
});