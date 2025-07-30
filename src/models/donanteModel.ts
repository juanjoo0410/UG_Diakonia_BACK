import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IDonante } from '../interfaces/IDonante';

export class Donante extends Model<IDonante> implements IDonante {
    public idDonante?: number;
    public codigo!: string;
    public nombre!: string;
    public tipoPersona!: string;
    public identificacion!: string;
    public representanteLegal!: string;
    public abreviatura!: string;
    public estado?: boolean;
}

Donante.init(
    {
        idDonante: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        tipoPersona: { type: DataTypes.STRING(10), allowNull: false },
        identificacion: { type: DataTypes.STRING(15), allowNull: false },
        representanteLegal: { type: DataTypes.STRING(150), allowNull: false },
        abreviatura: { type: DataTypes.STRING(15), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'donantes',
        timestamps: true
    }
);