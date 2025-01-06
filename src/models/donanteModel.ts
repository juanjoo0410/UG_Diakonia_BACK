import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IDonante } from '../interfaces/IDonante';

export class Donante extends Model<IDonante> implements IDonante {
    public idDonante?: number;
    public codigo!: string;
    public identificacion!: string;
    public nombre!: string;
    public tipoPersona!: string;
    public direccion!: string;
    public telefono!: string;
    public correo!: string;
    public nombreContacto!: string;
    public abreviatura!: string;
    public estado?: boolean;
}

Donante.init(
    {
        idDonante: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        identificacion: { type: DataTypes.STRING(13), allowNull: false },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        tipoPersona: { type: DataTypes.STRING(10), allowNull: false },
        direccion: { type: DataTypes.STRING(200), allowNull: false },
        telefono: { type: DataTypes.STRING(25), allowNull: false },
        correo: { type: DataTypes.STRING(100), allowNull: false },
        nombreContacto: { type: DataTypes.STRING(100), allowNull: false },
        abreviatura: { type: DataTypes.STRING(15), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'donantes',
        timestamps: true
    }
);