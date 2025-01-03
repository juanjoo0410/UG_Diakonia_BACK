import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IEstablecimiento } from '../interfaces/IEstablecimiento';
import { Donante } from './donanteModel';

export class Establecimiento extends Model<IEstablecimiento> implements IEstablecimiento {
    public idEstablecimiento?: number;
    public codigo!: string;
    public nombre!: string;
    public idDonante!: number;
    public direccion!: string;
    public telefono!: string;
    public estado?: boolean;
    public donante?: Donante | undefined;
}

Establecimiento.init(
    {
        idEstablecimiento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(13), allowNull: false },
        idDonante: { type: DataTypes.INTEGER,
            references: {
                model: 'donantes',
                key: 'idDonante'
            } },
        direccion: { type: DataTypes.STRING(120), allowNull: false },
        telefono: { type: DataTypes.STRING(200), allowNull: false },
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