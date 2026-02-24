import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IVoluntario } from '../interfaces/voluntario.interface';
import { IInstitucion } from '../interfaces/IInstitucion';
import { Institucion } from './institucionModel';

export class Voluntario extends Model<IVoluntario> implements IVoluntario {
    public idVoluntario?: number;
    public codigo!: string;
    public esExtranjero!: boolean;
    public identificacion!: string;
    public nombre!: string;
    public sexo!: string;
    public idInstitucion?: number;
    public institucion?: IInstitucion | undefined;
    public familia!: boolean;
    public voluntarioEducativo!: boolean;
    public voluntarioCorporativo!: boolean;
    public recibeKit!: boolean;
    public observaciones!: string;
    public estado?: boolean;
}

Voluntario.init(
    {
        idVoluntario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        esExtranjero: { type: DataTypes.BOOLEAN, allowNull: false },
        identificacion: { type: DataTypes.STRING(15), allowNull: false },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        sexo: { type: DataTypes.STRING(1), allowNull: false },
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
        voluntarioCorporativo: { type: DataTypes.BOOLEAN, allowNull: false },
        recibeKit: { type: DataTypes.BOOLEAN, allowNull: false },
        observaciones: { type: DataTypes.STRING(200), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'voluntarios',
        timestamps: true
    }
);

Voluntario.belongsTo(Institucion, {
    foreignKey: 'idInstitucion',
    as: 'institucion'
});