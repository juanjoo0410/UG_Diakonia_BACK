import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITransferencia } from '../interfaces/ITransferencia';
import { Bodega } from './bodegaModel';

export class Transferencia extends Model<ITransferencia> implements ITransferencia {
    public idTransferencia?: number;
    public descripcion!: string;
    public totalPeso!: number;
    public estado?: boolean;
    public fecha?: Date;
    public bodegaOrigen?: Bodega | undefined;
    public bodegaDestino?: Bodega | undefined;
}

Transferencia.init(
    {
        idTransferencia: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        totalPeso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        sequelize,
        tableName: 'transferencias',
        timestamps: false
    }
);

Transferencia.belongsTo(Bodega, {
    foreignKey: 'idBodegaOrigen',
    as: 'bodegaOrigen'
});

Transferencia.belongsTo(Bodega, {
    foreignKey: 'idBodegaDestino',
    as: 'bodegaDestino'
});