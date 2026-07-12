import { DataTypes, Model } from "sequelize";
import { IRubroTesoreria } from "../interfaces/rubro-tesoreria.interface";
import sequelize from "../config/db";

export class RubroTesoreria extends Model<IRubroTesoreria> implements IRubroTesoreria {
    public id?: number;
    public codigo!: string;
    public nombre!: string;
    public tipo!: string;
    public anulado?: boolean;
}

RubroTesoreria.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(25), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(75), allowNull: false },
    tipo: { type: DataTypes.STRING(50), allowNull: false },
    anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    tableName: 'rubros_tesoreria',
    timestamps: true
});