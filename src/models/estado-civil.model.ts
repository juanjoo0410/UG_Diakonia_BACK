import { DataTypes, Model } from "sequelize";
import { IBaseMaster } from "../interfaces/base-master.interface";
import sequelize from "../config/db";

export class EstadoCivil extends Model<IBaseMaster> implements IBaseMaster {
    public id?: number;
    public codigo!: string;
    public nombre!: string;
    public tipo!: string;
    public anulado?: boolean;
}

EstadoCivil.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    codigo: { type: DataTypes.STRING(25), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(75), allowNull: false },
    anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    tableName: 'estados_civil',
    timestamps: true
});