import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { IDivisaDenominacion } from "../interfaces/divisa-denominacion.interface";
import { Divisa } from "./divisa.model";

export class DivisaDenominacion extends Model<IDivisaDenominacion> implements IDivisaDenominacion {
    public id?: number;
    public divisaId!: number;
    public tipo!: String;
    public descripcion!: string;
    public valor!: number;
    public anulado?: boolean;
}

DivisaDenominacion.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    divisaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'divisas', key: 'id' }
    },
    tipo: { type: DataTypes.STRING(25), allowNull: false },
    descripcion: { type: DataTypes.STRING(200), allowNull: false },
    valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    tableName: 'divisas_denominaciones',
    timestamps: true
});

Divisa.hasMany(DivisaDenominacion, {
    foreignKey: 'divisaId',
    as: 'denominaciones'
})

DivisaDenominacion.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});