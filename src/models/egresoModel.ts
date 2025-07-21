import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { TipoTransaccion } from './tipoTransaccionModel';
import { IEgreso } from '../interfaces/IEgreso';

export class Egreso extends Model<IEgreso> implements IEgreso {
    public idEgreso?: number;
    public idTipoTransaccion!: number;
    public descripcion!: string;
    public idInstitucion?: number
    public totalPeso!: number;
    public usuario!: string;
    public estado?: boolean;
    public fecha?: Date;
    public tipoTransaccion?: TipoTransaccion | undefined;
}

Egreso.init(
    {
        idEgreso: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idTipoTransaccion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_transaccion',
                key: 'idTipoTransaccion'
            }
        },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        idInstitucion: { type: DataTypes.INTEGER, allowNull: false, },
        totalPeso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        usuario: { type: DataTypes.STRING(75), allowNull: false, },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        sequelize,
        tableName: 'egresos',
        timestamps: false
    }
);

Egreso.belongsTo(TipoTransaccion, {
    foreignKey: 'idTipoTransaccion',
    as: 'tipoTransaccion'
});