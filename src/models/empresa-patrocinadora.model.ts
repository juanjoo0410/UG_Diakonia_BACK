import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { IEmpresaPatrocinadora } from "../interfaces/empresa-patrocinadora.interface";

export class EmpresaPatrocinadora extends Model<IEmpresaPatrocinadora> implements IEmpresaPatrocinadora {
    public id?: number;
    public codigo!: string;
    public nombre!: string;
    public ruc!: string;
    public anulado?: boolean;
}

EmpresaPatrocinadora.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    ruc: { type: DataTypes.STRING(13), allowNull: false },
    anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    tableName: 'empresas_patrocinadoras',
    timestamps: true
});