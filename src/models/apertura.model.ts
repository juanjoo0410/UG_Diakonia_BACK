import { DataTypes, Model } from "sequelize";
import { IApertura } from "../interfaces/apertura.interface";
import sequelize from "../config/db";
import { CajaBanco } from "./caja-banco.model";
import { Usuario } from "./usuarioModel";
import { IngresoTesoreria } from "./ingreso-tesoreria.model";

export class Apertura extends Model<IApertura> implements IApertura {
    public id?: number;
    public fecha!: Date;
    public cajaId!: number;
    public encargadoId!: number;
    public fondoFijo!: number;
    public cerrada!: boolean;
    public cerradaPor?: number;
    public cerradaFecha?: number;
    public ingresoTesoreriaId?: number;
    public faltante!: number;
    public sobrante!: number;
}

Apertura.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    cajaId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' } },
    encargadoId: { type: DataTypes.INTEGER, references: { model: 'usuarios', key: 'idUsuario' } },
    fondoFijo: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    cerrada: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    cerradaPor: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'usuarios', key: 'idUsuario' } },
    cerradaFecha: { type: DataTypes.DATE, allowNull: true },
    ingresoTesoreriaId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'ingresos_tesoreria', key: 'id' } },
    faltante: { type: DataTypes.INTEGER, allowNull: false },
    sobrante: { type: DataTypes.INTEGER, allowNull: false },
}, {
    sequelize,
    tableName: 'aperturas',
    timestamps: true
});

Apertura.belongsTo(CajaBanco, { foreignKey: 'cajaId', as: 'caja' });
Apertura.belongsTo(Usuario, { foreignKey: 'encargadoId', as: 'encargado' });
Apertura.belongsTo(Usuario, { foreignKey: 'cerradaPor', as: 'cerradaPor' });
Apertura.belongsTo(IngresoTesoreria, { foreignKey: 'ingresoTesoreriaId', as: 'ingreso' });