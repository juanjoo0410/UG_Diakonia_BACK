import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IIngreso } from '../interfaces/IIngreso';
import { TipoTransaccion } from './tipoTransaccionModel';

export class Ingreso extends Model<IIngreso> implements IIngreso {
    public idIngreso?: number;
    public idTipoTransaccion!: number;
    public descripcion!: string;
    public idDonante?: number;
    public totalPeso!: number;
    public estado?: boolean;
    public fecha?: Date;
    public tipoTransaccion?: TipoTransaccion | undefined;
}

Ingreso.init(
    {
        idIngreso: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idTipoTransaccion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_transaccion',
                key: 'idTipoTransaccion'
            }
        },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        idDonante: { type: DataTypes.INTEGER, allowNull: false },
        totalPeso: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        sequelize,
        tableName: 'ingresos',
        timestamps: false
    }
);

Ingreso.belongsTo(TipoTransaccion, {
    foreignKey: 'idTipoTransaccion',
    as: 'tipoTransaccion'
});