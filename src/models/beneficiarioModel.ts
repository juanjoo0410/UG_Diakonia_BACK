import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IBeneficiario } from '../interfaces/IBeneficiario';

export class Beneficiario extends Model<IBeneficiario> implements IBeneficiario {
    public idBeneficiario?: number;
    public codigo!: string;
    public esExtranjero!: boolean;
    public identificacion!: string;
    public nombre!: string;
    public estadoCivil!: string;
    public sexo!: string;
    public direccion!: string;
    public telefono!: string;
    public correo!: string;
    public esEmpleado!: boolean;
    public estado?: boolean;
}

Beneficiario.init(
    {
        idBeneficiario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(7), allowNull: false },
        esExtranjero: { type: DataTypes.BOOLEAN, allowNull: false },
        identificacion: { type: DataTypes.STRING(15), allowNull: false },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        estadoCivil: { type: DataTypes.STRING(15), allowNull: false },
        sexo: { type: DataTypes.STRING(1), allowNull: false },
        direccion: { type: DataTypes.STRING(200), allowNull: false },
        telefono: { type: DataTypes.STRING(25), allowNull: false },
        correo: { type: DataTypes.STRING(100), allowNull: false },
        esEmpleado: { type: DataTypes.BOOLEAN, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'beneficiarios',
        timestamps: true
    }
);