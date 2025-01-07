import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IBeneficiario } from '../interfaces/IBeneficiario';
import { TipoOrg } from './tipoOrgModel';
import { TipoPoblacion } from './tipoPoblacionModel';
import { Clasificacion } from './clasificacionModel';

export class Beneficiario extends Model<IBeneficiario> implements IBeneficiario {
    public idBeneficiario?: number;
    public codigo!: string;
    public identificacion!: string;
    public nombre!: string;
    public tipoBeneficiario!: string;
    public idTipoOrg!: number;
    public idTipoPoblacion!: number;
    public idClasificacion!: number;
    public actividad!: string;
    public totalBeneficiarios!: number;
    public direccion!: string;
    public telefono!: string;
    public correo!: string;
    public nombreContacto!: string;
    public estado?: boolean;
    public tipoOrg?: TipoOrg | undefined;
    public tipoPoblacion?: TipoPoblacion | undefined;
    public clasificacion?: Clasificacion | undefined;
}

Beneficiario.init(
    {
        idBeneficiario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        identificacion: { type: DataTypes.STRING(15), allowNull: false },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        tipoBeneficiario: { type: DataTypes.STRING(15), allowNull: false },
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
        telefono: { type: DataTypes.STRING(25), allowNull: false },
        correo: { type: DataTypes.STRING(100), allowNull: false },
        nombreContacto: { type: DataTypes.STRING(100), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'beneficiarios',
        timestamps: true
    }
);

Beneficiario.belongsTo(TipoOrg, {
    foreignKey: 'idTipoOrg',
    as: 'tipoOrg'
});

Beneficiario.belongsTo(TipoPoblacion, {
    foreignKey: 'idTipoPoblacion',
    as: 'tipoPoblacion'
});

Beneficiario.belongsTo(Clasificacion, {
    foreignKey: 'idClasificacion',
    as: 'clasificacion'
});