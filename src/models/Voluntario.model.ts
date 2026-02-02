import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IVoluntario } from '../interfaces/voluntario.interface';
import { ITipoJornada } from '../interfaces/tipo-jornada.interface';
import { TipoJornada } from './TipoJornada.model';

export class Voluntario extends Model<IVoluntario> implements IVoluntario {
    public idVoluntario?: number;
    public codigo!: string;
    public esExtranjero!: boolean;
    public identificacion!: string;
    public nombre!: string;
    public sexo!: string;
    public idTipoJornada!: number;
    public tipoJornada?: ITipoJornada | undefined;
    public recibeKit!: boolean;
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
        idTipoJornada: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_jornada',
                key: 'idTipoJornada'
            }
        },
        recibeKit: { type: DataTypes.BOOLEAN, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'voluntarios',
        timestamps: true
    }
);

Voluntario.belongsTo(TipoJornada, {
    foreignKey: 'idTipoJornada',
    as: 'tipoJornada'
});