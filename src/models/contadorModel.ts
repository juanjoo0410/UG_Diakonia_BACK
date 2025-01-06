import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IContador } from '../interfaces/IContador';

export class Contador extends Model<IContador> implements IContador {
    public idContador?: number;
    public nombre!: string;
    public prefijo!: string;
    public numFormato!: number;
    public ultimoValor!: number;
    public estado?: boolean;
}

Contador.init(
    {
        idContador: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING(20), allowNull: false },
        prefijo: { type: DataTypes.STRING(6), allowNull: false },
        numFormato: { type: DataTypes.INTEGER, allowNull: false },
        ultimoValor: { type: DataTypes.INTEGER, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'contadores',
        timestamps: true
    }
);