import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IBanco } from '../interfaces/IBanco';

export class Banco extends Model<IBanco> implements IBanco {
    public idBanco?: number;
    public codigo!: string;
    public nombre!: string;
    public estado?: boolean;
}

Banco.init(
    {
        idBanco: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(20), allowNull: false },
        nombre: { type: DataTypes.STRING(75), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'bancos',
        timestamps: true
    }
);
