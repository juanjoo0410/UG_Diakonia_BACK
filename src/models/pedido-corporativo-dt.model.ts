import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { IPedidoCorporativoDt } from "../interfaces/pedido-corporativo-dt.interface";
import { PedidoCorporativo } from "./pedido-corporativo.model";
import { Producto } from "./productoModel";
import { Bodega } from "./bodegaModel";
import { Ubicacion } from "./ubicacionModel";

export class PedidoCorporativoDt extends Model<IPedidoCorporativoDt> implements IPedidoCorporativoDt {
    public id?: number;
    public pedidoCorporativoId!: number;
    public productoId!: number;
    public bodegaId!: number;
    public ubicacionId!: number;
    public cantidad!: number;
    public precioUnd!: number;
    public subtotal!: number;
    public descuento!: number;
    public total!: number;
    public peso!: number;
    public anulado?: boolean;
}

PedidoCorporativoDt.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        pedidoCorporativoId: { type: DataTypes.INTEGER, references: { model: 'pedidos_corporativos', key: 'id' } },
        productoId: { type: DataTypes.INTEGER, references: { model: 'productos', key: 'idProducto' } },
        bodegaId: { type: DataTypes.INTEGER, references: { model: 'bodegas', key: 'idBodega' } },
        ubicacionId: { type: DataTypes.INTEGER, references: { model: 'ubicaciones', key: 'idUbicacion' } },
        cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        precioUnd: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        peso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
        sequelize,
        tableName: 'pedidos_corporativos_dt',
        timestamps: false
    }
);

PedidoCorporativo.hasMany(PedidoCorporativoDt, { foreignKey: 'pedidoCorporativoId', as: 'detalles' });
PedidoCorporativoDt.belongsTo(PedidoCorporativo, { foreignKey: 'pedidoCorporativoId', as: 'pedidoCorporativo' });
PedidoCorporativoDt.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
PedidoCorporativoDt.belongsTo(Bodega, { foreignKey: 'bodegaId', as: 'bodega' });
PedidoCorporativoDt.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });