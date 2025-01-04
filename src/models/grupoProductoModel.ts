import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IGrupoProducto } from '../interfaces/IGrupoProducto';

export class GrupoProducto extends Model<IGrupoProducto> implements IGrupoProducto {
    public idGrupoProducto?: number;
    public codigo!: string;
    public nombre!: string;
    public estado?: boolean;
}

GrupoProducto.init(
    {
        idGrupoProducto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        nombre: { type: DataTypes.STRING(50), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'grupos_producto',
        timestamps: true
    }
);