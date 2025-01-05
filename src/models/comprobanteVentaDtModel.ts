import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { Producto } from './productoModel';
import { IComprobanteVentaDt } from '../interfaces/IComprobanteVentaDt';
import { ComprobanteVenta } from './comprobanteVentaModel';

export class ComprobanteVentaDt extends Model<IComprobanteVentaDt> implements IComprobanteVentaDt {
    public idComprobanteVentaDt?: number;
    public idComprobanteVenta!: number;
    public idProducto!: number;
    public cantidad!: number;
    public precioUnd!: number;
    public total!: number;
    public estado?: boolean;
    public comprobanteVenta?: ComprobanteVenta | undefined;
    public producto?: Producto | undefined;
}

ComprobanteVentaDt.init(
    {
        idComprobanteVentaDt: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idComprobanteVenta: {
            type: DataTypes.INTEGER,
            references: {
                model: 'comprobantes_venta',
                key: 'idComprobanteVenta'
            }
        },
        idProducto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'productos',
                key: 'idProducto'
            }
        },
        cantidad: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        precioUnd: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'comprobantes_venta_dt',
        timestamps: false
    }
);

ComprobanteVenta.hasMany(ComprobanteVentaDt, {
    foreignKey: 'idComprobanteVenta',
    as: 'comvenDetalles'
})

ComprobanteVentaDt.belongsTo(ComprobanteVenta, {
    foreignKey: 'idComprobanteVenta',
    as: 'comprobanteVenta'
});

ComprobanteVentaDt.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});