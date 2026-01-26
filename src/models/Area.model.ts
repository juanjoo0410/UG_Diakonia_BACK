import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IArea } from '../interfaces/area.interface';

export class Area extends Model<IArea> implements IArea {
    public idArea?: number;
    public codigo!: string;
    public nombre!: string;
    public estado?: boolean;
}

Area.init(
    {
        idArea: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        nombre: { type: DataTypes.STRING(50), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'areas',
        timestamps: true
    }
);