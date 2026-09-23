import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { IProductoComposicion } from "../interfaces/producto-composicion.interface";
import { Producto } from "./productoModel";

export class ProductoComposicion extends Model<IProductoComposicion> implements IProductoComposicion {
    public id?: number;
    public productoId!: number;
    public composicionId!: number;
    public cantidad!: number;
}

ProductoComposicion.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        productoId: { type: DataTypes.INTEGER, references: { model: 'productos', key: 'idProducto' } },
        composicionId: { type: DataTypes.INTEGER, references: { model: 'productos', key: 'idProducto' } },
        cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
        sequelize,
        tableName: 'productos_composiciones',
        timestamps: false
    }
);

Producto.hasMany(ProductoComposicion, { foreignKey: 'productoId', as: 'composiciones' });
ProductoComposicion.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
ProductoComposicion.belongsTo(Producto, { foreignKey: 'composicionId', as: 'composicion' });