import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { TipoTransaccion } from './tipoTransaccionModel';
import { IEgreso } from '../interfaces/IEgreso';

export class Egreso extends Model<IEgreso> implements IEgreso {
    public idEgreso?: number;
    public idTipoTransaccion!: number;
    public descripcion!: string;
    public idBeneficiario!: number
    public totalPeso!: number;
    public estado?: boolean;
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
        idBeneficiario: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        totalPeso: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'egresos',
        timestamps: true
    }
);

Egreso.belongsTo(TipoTransaccion, {
    foreignKey: 'idTipoTransaccion',
    as: 'tipoTransaccion'
});