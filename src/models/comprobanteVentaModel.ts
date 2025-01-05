import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IComprobanteVenta } from '../interfaces/IComprobanteVenta';
import { Cliente } from './clienteModel';

export class ComprobanteVenta extends Model<IComprobanteVenta> implements IComprobanteVenta {
    public idComprobanteVenta?: number;
    public idCliente!: number;
    public tipoPago!: string;
    public subtotal!: number;
    public descuento!: number;
    public total!: number;
    public estado?: boolean;
    public cliente?: Cliente | undefined;
}

ComprobanteVenta.init(
    {
        idComprobanteVenta: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idCliente: {
            type: DataTypes.INTEGER,
            references: {
                model: 'clientes',
                key: 'idCliente'
            }
        },
        tipoPago: { type: DataTypes.STRING(25), allowNull: false },
        subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        descuento: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'comprobantes_venta',
        timestamps: true
    }
);

ComprobanteVenta.belongsTo(Cliente, {
    foreignKey: 'idCliente',
    as: 'cliente'
});