import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITipoPoblacion } from '../interfaces/ITipoPoblacion';

export class TipoPoblacion extends Model<ITipoPoblacion> implements ITipoPoblacion {
    public idTipoPoblacion?: number;
    public codigo!: string;
    public nombre!: string;
    public descripcion!: string;
    public estado?: boolean;
}

TipoPoblacion.init(
    {
        idTipoPoblacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'tipos_poblacion',
        timestamps: true
    }
);