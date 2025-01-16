import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IComprobanteVenta } from '../interfaces/IComprobanteVenta';
import { Cliente } from './clienteModel';

export class ComprobanteVenta extends Model<IComprobanteVenta> implements IComprobanteVenta {
    public idComprobanteVenta?: number;
    public idCliente!: number;
    public tipoPago!: string;
    public banco!: string;
    public subtotal!: number;
    public descuento!: number;
    public valorCupon!: number;
    public total!: number;
    public usuario!: string;
    public estado?: boolean;
    public fecha?: Date;
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
        banco: { type: DataTypes.STRING(75), allowNull: false, },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        valorCupon: { type: DataTypes.INTEGER, allowNull: false },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        usuario: { type: DataTypes.STRING(75), allowNull: false, },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        sequelize,
        tableName: 'comprobantes_venta',
        timestamps: false
    }
);

ComprobanteVenta.belongsTo(Cliente, {
    foreignKey: 'idCliente',
    as: 'cliente'
});