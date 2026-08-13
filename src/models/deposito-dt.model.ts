import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { Divisa } from "./divisa.model";
import { IDepositoDt } from "../interfaces/deposito-dt.interface";
import { Deposito } from "./deposito.model";
import { IngresoTesoreriaDt } from "./ingreso-tesoreria-dt.model";

export class DepositoDt extends Model<IDepositoDt> implements IDepositoDt {
    public id?: number;
    public depositoId!: number;
    public ingresoTesoreriaDtId!: number;
    public tipoValor!: string;
    public divisaId!: number;
    public importe!: number;
    public valor!: number;
}

DepositoDt.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        depositoId: { type: DataTypes.INTEGER, references: { model: 'depositos', key: 'id' }},
        ingresoTesoreriaDtId: { type: DataTypes.INTEGER, references: { model: 'ingresos_tesoreria_dt', key: 'id' }},
        tipoValor: { type: DataTypes.STRING(25), allowNull: false },
        divisaId: { type: DataTypes.INTEGER, references: { model: 'divisas', key: 'id' }},
        importe: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false }
    },
    {
        sequelize,
        tableName: 'depositos_dt',
        timestamps: false
    }
);

Deposito.hasMany(DepositoDt, {
    foreignKey: 'depositoId',
    as: 'detalles'
})

DepositoDt.hasMany(Deposito, {
    foreignKey: 'depositoId',
    as: 'deposito'
})

DepositoDt.belongsTo(IngresoTesoreriaDt, {
    foreignKey: 'ingresoTesoreriaDtId',
    as: 'ingresoTesoreriaDt'
});

DepositoDt.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});