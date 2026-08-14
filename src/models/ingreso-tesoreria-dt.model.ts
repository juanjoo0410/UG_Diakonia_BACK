import { DataTypes, Model } from "sequelize";
import { IIngresoTesoreriaDt } from "../interfaces/ingreso-tesoreria-dt.interface";
import sequelize from "../config/db";
import { Divisa } from "./divisa.model";
import { IngresoTesoreria } from "./ingreso-tesoreria.model";
import { CajaBanco } from "./caja-banco.model";

export class IngresoTesoreriaDt extends Model<IIngresoTesoreriaDt> implements IIngresoTesoreriaDt {
    public id?: number;
    public ingresoTesoreriaId!: number;
    public tipoValor!: string;
    public divisaId!: number;
    public valor!: number;
    public depositado!: number;
    public bancoId?: number;
}

IngresoTesoreriaDt.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        ingresoTesoreriaId: { type: DataTypes.INTEGER, references: { model: 'ingresos_tesoreria', key: 'id' }},
        tipoValor: { type: DataTypes.STRING(25), allowNull: false },
        divisaId: { type: DataTypes.INTEGER, references: { model: 'divisas', key: 'id' }},
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        depositado: { type: DataTypes.DECIMAL(18, 2), allowNull: false, defaultValue: 0 },
        bancoId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cajas_bancos', key: 'id' } },
    },
    {
        sequelize,
        tableName: 'ingresos_tesoreria_dt',
        timestamps: false
    }
);

IngresoTesoreria.hasMany(IngresoTesoreriaDt, {
    foreignKey: 'ingresoTesoreriaId',
    as: 'detalles'
})

IngresoTesoreriaDt.hasMany(IngresoTesoreria, {
    foreignKey: 'ingresoTesoreriaId',
    as: 'ingreso'
})

IngresoTesoreriaDt.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});

IngresoTesoreriaDt.belongsTo(CajaBanco, {
    foreignKey: 'bancoId',
    as: 'banco'
});