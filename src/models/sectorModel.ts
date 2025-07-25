import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ISector } from '../interfaces/ISector';

export class Sector extends Model<ISector> implements ISector {
    public idSector?: number;
    public codigo!: string;
    public nombre!: string;
    public estado?: boolean;
}

Sector.init(
    {
        idSector: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(50), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'sectores',
        timestamps: true
    }
);