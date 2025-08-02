import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IEstablecimiento } from '../interfaces/IEstablecimiento';
import { Donante } from './donanteModel';

export class Establecimiento extends Model<IEstablecimiento> implements IEstablecimiento {
    public idEstablecimiento?: number;
    public codigo!: string;
    public nombre!: string;
    public identificacion?: string;
    public representanteLegal?: string;
    public idDonante!: number;
    public direccion!: string;
    public direccionUrl!: string;
    public latitud!: number;
    public longitud!: number;
    public idSector!: number;
    public nombreContacto!: string;
    public telefono!: string;
    public correo!: string;
    public estado?: boolean;
    public donante?: Donante | undefined;
}

Establecimiento.init(
    {
        idEstablecimiento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(120), allowNull: false },
        identificacion: { type: DataTypes.STRING(15), allowNull: true },
        representanteLegal: { type: DataTypes.STRING(150), allowNull: true },
        idDonante: {
            type: DataTypes.INTEGER,
            references: {
                model: 'donantes',
                key: 'idDonante'
            }
        },
        direccion: { type: DataTypes.STRING(120), allowNull: false },
        direccionUrl: { type: DataTypes.STRING(300), allowNull: false },
        latitud: { type: DataTypes.DECIMAL(17, 14), allowNull: false },
        longitud: { type: DataTypes.DECIMAL(17, 14), allowNull: false },
        idSector: {
            type: DataTypes.INTEGER,
            references: {
                model: 'sectores',
                key: 'idSector'
            }
        },
        nombreContacto: { type: DataTypes.STRING(100), allowNull: false },
        telefono: { type: DataTypes.STRING(100), allowNull: false },
        correo: { type: DataTypes.STRING(200), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'establecimientos',
        timestamps: true
    }
);

Establecimiento.belongsTo(Donante, {
    foreignKey: 'idDonante',
    as: 'donante'
});