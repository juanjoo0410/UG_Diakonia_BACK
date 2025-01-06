import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITransferencia } from '../interfaces/ITransferencia';
import { Bodega } from './bodegaModel';

export class Transferencia extends Model<ITransferencia> implements ITransferencia {
    public idTransferencia?: number;
    public descripcion!: string;
    public idBodegaOrigen!: number;
    public idBodegaDestino!: number;
    public totalPeso!: number;
    public estado?: boolean;
    public bodegaOrigen?: Bodega | undefined;
    public bodegaDestino?: Bodega | undefined;
}

Transferencia.init(
    {
        idTransferencia: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        idBodegaOrigen: {
            type: DataTypes.INTEGER,
            references: {
                model: 'bodegas',
                key: 'idBodega'
            }
        },
        idBodegaDestino: {
            type: DataTypes.INTEGER,
            references: {
                model: 'bodegas',
                key: 'idBodega'
            }
        },
        totalPeso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'transferencias',
        timestamps: true
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