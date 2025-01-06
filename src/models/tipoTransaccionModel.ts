import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITipoTransaccion } from '../interfaces/ITipoTransaccion';

export class TipoTransaccion extends Model<ITipoTransaccion> implements ITipoTransaccion {
    public idTipoTransaccion?: number;
    public nombre!: string;
    public ingreso!: boolean;
    public egreso!: boolean;
    public estado?: boolean;
}

TipoTransaccion.init(
    {
        idTipoTransaccion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        ingreso: { type: DataTypes.BOOLEAN, allowNull: false },
        egreso: { type: DataTypes.BOOLEAN, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'tipos_transaccion',
        timestamps: true
    }
);