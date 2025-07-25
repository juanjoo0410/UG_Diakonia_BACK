import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IInstitucion } from '../interfaces/IInstitucion';
import { TipoOrg } from './tipoOrgModel';
import { TipoPoblacion } from './tipoPoblacionModel';
import { Clasificacion } from './clasificacionModel';
import { Sector } from './sectorModel';
import { ProyectoInstitucion } from './proyectoInstitucionModel';

export class Institucion extends Model<IInstitucion> implements IInstitucion {
    public idInstitucion?: number;
    public codigo!: string;
    public nombre!: string;
    public identificacion!: string;
    public representanteLegal!: string;
    public fechaIngreso!: Date;
    public tipo!: string;
    public idTipoOrg!: number;
    public idTipoPoblacion!: number;
    public idClasificacion!: number;
    public actividad!: string;
    public totalBeneficiarios!: number;
    public direccion!: string;
    public direccionUrl!: string;
    public latitud!: number;
    public longitud!: number;
    public idSector!: number;
    public nombreContacto!: string;
    public telefono!: string;
    public correo!: string;
    public estado?: boolean;
    public tipoOrg?: TipoOrg | undefined;
    public tipoPoblacion?: TipoPoblacion | undefined;
    public clasificacion?: Clasificacion | undefined;
    public sector?: Sector | undefined;
}

Institucion.init(
    {
        idInstitucion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        identificacion: { type: DataTypes.STRING(15), allowNull: false },
        representanteLegal: { type: DataTypes.STRING(150), allowNull: false },
        fechaIngreso: { type: DataTypes.DATE, allowNull: true },
        tipo: { type: DataTypes.STRING(15), allowNull: false },
        idTipoOrg: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_org',
                key: 'idTipoOrg'
            }
        },
        idTipoPoblacion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_poblacion',
                key: 'idTipoPoblacion'
            }
        },
        idClasificacion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'clasificacion',
                key: 'idClasificacion'
            }
        },
        actividad: { type: DataTypes.STRING(100), allowNull: false },
        totalBeneficiarios: { type: DataTypes.INTEGER, allowNull: false },
        direccion: { type: DataTypes.STRING(200), allowNull: false },
        direccionUrl: { type: DataTypes.STRING(300), allowNull: false },
        latitud: { type: DataTypes.DECIMAL(17, 14), allowNull: false },
        longitud: { type: DataTypes.DECIMAL(17, 14), allowNull: false },
        idSector: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sectores',
                key: 'idSector'
            }
        },
        nombreContacto: { type: DataTypes.STRING(100), allowNull: false },
        telefono: { type: DataTypes.STRING(100), allowNull: false },
        correo: { type: DataTypes.STRING(200), allowNull: false },        
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'instituciones',
        timestamps: true
    }
);

Institucion.belongsTo(TipoOrg, {
    foreignKey: 'idTipoOrg',
    as: 'tipoOrg'
});

Institucion.belongsTo(TipoPoblacion, {
    foreignKey: 'idTipoPoblacion',
    as: 'tipoPoblacion'
});

Institucion.belongsTo(Clasificacion, {
    foreignKey: 'idClasificacion',
    as: 'clasificacion'
});

Institucion.belongsTo(Sector, {
    foreignKey: 'idSector',
    as: 'sector'
});

Institucion.hasMany(ProyectoInstitucion, {
    foreignKey: 'idInstitucion',
    as: 'proyectos_instituciones'
});

ProyectoInstitucion.belongsTo(Institucion, {
    foreignKey: 'idInstitucion',
    as: 'instituciones'
});