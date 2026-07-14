import { DataTypes, Model } from "sequelize";
import { IIngresoTesoreriaDt } from "../interfaces/ingreso-tesoreria-dt.interface";
import sequelize from "../config/db";
import { Divisa } from "./divisa.model";
import { IngresoTesoreria } from "./ingreso-tesoreria.model";

export class IngresoTesoreriaDt extends Model<IIngresoTesoreriaDt> implements IIngresoTesoreriaDt {
    public id?: number;
    public ingresoTesoreriaId!: number;
    public tipoValor!: string;
    public divisaId!: number;
    public cambio!: number;
    public valor!: number;
}

IngresoTesoreriaDt.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        ingresoTesoreriaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ingresos_tesoreria',
                key: 'id'
            }
        },
        tipoValor: { type: DataTypes.STRING(25), allowNull: false },
        divisaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'divisas',
                key: 'id'
            }
        },
        cambio: { type: DataTypes.DECIMAL(18, 4), allowNull: false },
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
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