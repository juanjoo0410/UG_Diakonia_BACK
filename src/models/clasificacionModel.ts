import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IClasificacion } from '../interfaces/IClasificacion';

export class Clasificacion extends Model<IClasificacion> implements IClasificacion {
    public idClasificacion?: number;
    public nombre!: string;
    public estado?: boolean;
}

Clasificacion.init(
    {
        idClasificacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'clasificacion',
        timestamps: true
    }
);