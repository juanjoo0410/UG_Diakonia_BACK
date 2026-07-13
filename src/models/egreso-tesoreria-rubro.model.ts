import { DataTypes, Model } from "sequelize";
import { IEgresoTesoreriaRubro } from "../interfaces/egreso-tesoreria-rubro.interface";
import sequelize from "../config/db";
import { EgresoTesoreria } from "./egreso-tesoreria.model";
import { RubroTesoreria } from "./rubro-tesoreria.model";
import { Divisa } from "./divisa.model";

export class EgresoTesoreriaRubro extends Model<IEgresoTesoreriaRubro> implements IEgresoTesoreriaRubro {
    public id?: number;
    public egresoTesoreriaId!: number;
    public rubroTesoreriaId!: number;
    public divisaId!: number;
    public cambio!: number;
    public valor!: number;
}

EgresoTesoreriaRubro.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        egresoTesoreriaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'egresos_tesoreria',
                key: 'id'
            }
        },
        rubroTesoreriaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'rubros_tesoreria',
                key: 'id'
            }
        },
        divisaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'divisas',
                key: 'id'
            }
        },
        cambio: { type: DataTypes.DECIMAL(18,4), allowNull: false },
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    },
    {
        sequelize,
        tableName: 'egresos_tesoreria_rubros',
        timestamps: false
    }
);

EgresoTesoreria.hasMany(EgresoTesoreriaRubro, {
    foreignKey: 'egresoTesoreriaId',
    as: 'rubros'
})

EgresoTesoreriaRubro.hasMany(EgresoTesoreria, {
    foreignKey: 'egresoTesoreriaId',
    as: 'egreso'
})

EgresoTesoreriaRubro.belongsTo(RubroTesoreria, {
    foreignKey: 'rubroTesoreriaId',
    as: 'rubro'
});

EgresoTesoreriaRubro.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});