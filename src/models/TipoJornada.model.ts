import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITipoJornada } from '../interfaces/tipo-jornada.interface';

export class TipoJornada extends Model<ITipoJornada> implements ITipoJornada {
    public idTipoJornada?: number;
    public codigo!: string;
    public nombre!: string;
    public horas!: number;
    public estado?: boolean;
}

TipoJornada.init(
    {
        idTipoJornada: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        nombre: { type: DataTypes.STRING(20), allowNull: false },
        horas: { type: DataTypes.INTEGER, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'tipos_jornada',
        timestamps: true
    }
);