import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IBodega } from '../interfaces/IBodega';

export class Bodega extends Model<IBodega> implements IBodega {
    public idBodega?: number;
    public codigo!: string;
    public nombre!: string;
    public tipoProducto!: string;
    public responsable!: string;
    public venta!: boolean;
    public averiados!: boolean;
    public estado?: boolean;
}

Bodega.init(
    {
        idBodega: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(25), allowNull: false },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        tipoProducto: { type: DataTypes.STRING(50), allowNull: false },
        responsable: { type: DataTypes.STRING(100), allowNull: false },
        venta: { type: DataTypes.BOOLEAN, allowNull: false },
        averiados: { type: DataTypes.BOOLEAN, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'bodegas',
        timestamps: true
    }
);