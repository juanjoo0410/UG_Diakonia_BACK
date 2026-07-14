import { DataTypes, Model } from "sequelize";
import { IIngresoTesoreriaDenominacion } from "../interfaces/ingreso-tesoreria-denominacion.interface";
import sequelize from "../config/db";
import { Divisa } from "./divisa.model";
import { IngresoTesoreria } from "./ingreso-tesoreria.model";
import { DivisaDenominacion } from "./divisa-denominacion.model";

export class IngresoTesoreriaDenominacion extends Model<IIngresoTesoreriaDenominacion> implements IIngresoTesoreriaDenominacion {
    public id?: number;
    public ingresoTesoreriaId!: number;
    public denominacionId!: number;
    public cantidad!: number;
}

IngresoTesoreriaDenominacion.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        ingresoTesoreriaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ingresos_tesoreria',
                key: 'id'
            }
        },
        denominacionId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'divisas_denominaciones',
                key: 'id'
            }
        },
        cantidad: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize,
        tableName: 'ingresos_tesoreria_denominaciones',
        timestamps: false
    }
);

IngresoTesoreria.hasMany(IngresoTesoreriaDenominacion, {
    foreignKey: 'ingresoTesoreriaId',
    as: 'denominaciones'
})

IngresoTesoreriaDenominacion.hasMany(IngresoTesoreria, {
    foreignKey: 'ingresoTesoreriaId',
    as: 'ingreso'
})

IngresoTesoreriaDenominacion.belongsTo(DivisaDenominacion, {
    foreignKey: 'denominacionId',
    as: 'denominacion'
});

IngresoTesoreriaDenominacion.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});