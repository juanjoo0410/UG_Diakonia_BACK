import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { IDivisa } from "../interfaces/divisa.interface";

export class Divisa extends Model<IDivisa> implements IDivisa {
    public id?: number;
    public codigo!: string;
    public nombre!: string;
    public simbolo!: string;
    public cambio!: number;
    public divisaBase!: boolean;
    public anulado?: boolean;
}

Divisa.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    simbolo: { type: DataTypes.STRING(5), allowNull: false },
    cambio: { type: DataTypes.DECIMAL(18, 4), allowNull: false },
    divisaBase: { type: DataTypes.BOOLEAN, allowNull: false },
    anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    tableName: 'divisas',
    timestamps: true
});