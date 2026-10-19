import { DataTypes, Model } from "sequelize";
import { IReserva } from "../interfaces/reserva.interface";
import sequelize from "../config/db";
import { Producto } from "./productoModel";
import { Bodega } from "./bodegaModel";
import { Ubicacion } from "./ubicacionModel";

export class Reserva extends Model<IReserva> implements IReserva {
    public id?: number;
    public productoId!: number;
    public bodegaId!: number;
    public ubicacionId!: number;
    public reserva!: number;
    public pesoTotal!: number;
    public anulado?: boolean;
}

Reserva.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        productoId: { type: DataTypes.INTEGER, references: { model: 'productos', key: 'idProducto' } },
        bodegaId: { type: DataTypes.INTEGER, references: { model: 'bodegas', key: 'idBodega' } },
        ubicacionId: { type: DataTypes.INTEGER, references: { model: 'ubicaciones', key: 'idUbicacion' } },
        reserva: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        pesoTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
        sequelize,
        tableName: 'reservas',
        timestamps: true
    }
);

Reserva.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });
Reserva.belongsTo(Bodega, { foreignKey: 'bodegaId', as: 'bodega' });
Reserva.belongsTo(Ubicacion, { foreignKey: 'ubicacionId', as: 'ubicacion' });