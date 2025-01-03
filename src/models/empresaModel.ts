import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IEmpresa } from '../interfaces/IEmpresa';

export class Empresa extends Model<IEmpresa> implements IEmpresa {
    public idEmpresa?: number;
    public ruc!: string;
    public razonSocial!: string;
    public representanteLegal!: string;
    public direccion!: string;
    public telefono!: string;
    public rutaLogo!: string;
    public obligadoContabilidad!: boolean;
    public estado?: boolean;
}

Empresa.init(
    {
        idEmpresa: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        ruc: { type: DataTypes.STRING(13), allowNull: false },
        razonSocial: { type: DataTypes.STRING(200), allowNull: false },
        representanteLegal: { type: DataTypes.STRING(120), allowNull: false },
        direccion: { type: DataTypes.STRING(200), allowNull: false },
        telefono: { type: DataTypes.STRING(25), allowNull: false },
        rutaLogo: { type: DataTypes.STRING(300), allowNull: false },
        obligadoContabilidad: { type: DataTypes.BOOLEAN, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'empresa',
        timestamps: true
    }
);