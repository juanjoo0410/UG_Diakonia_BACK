import { DataTypes, Model } from "sequelize";
import { IIngresoTesoreriaDocumento } from "../interfaces/ingreso-tesoreria-documentos.interface";
import sequelize from "../config/db";
import { IngresoTesoreria } from "./ingreso-tesoreria.model";
import { Divisa } from "./divisa.model";

export class IngresoTesoreriaDocumento extends Model<IIngresoTesoreriaDocumento> implements IIngresoTesoreriaDocumento {
    public id?: number;
    public ingresoTesoreriaId!: number;
    public documentoId!: number;
    public fecha!: Date;
    public tipo!: string;
    public numero!: string;
    public descripcion!: string;
    public divisaId!: number;
    public valor!: number;
    public cajeroId!: number;
}

IngresoTesoreriaDocumento.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        ingresoTesoreriaId: { type: DataTypes.INTEGER, references: { model: 'ingresos_tesoreria', key: 'id' }},
        documentoId: { type: DataTypes.INTEGER, allowNull: false },
        fecha: { type: DataTypes.DATE, allowNull: false },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        numero: { type: DataTypes.STRING(10), allowNull: false },
        descripcion: { type: DataTypes.STRING(200), allowNull: false },
        divisaId: { type: DataTypes.INTEGER, references: { model: 'divisas', key: 'id' }},
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        cajeroId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: 'ingresos_tesoreria_documentos',
        timestamps: false
    }
);

IngresoTesoreria.hasMany(IngresoTesoreriaDocumento, {
    foreignKey: 'ingresoTesoreriaId',
    as: 'documentos'
})

IngresoTesoreriaDocumento.hasMany(IngresoTesoreria, {
    foreignKey: 'ingresoTesoreriaId',
    as: 'ingreso'
})

IngresoTesoreriaDocumento.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});