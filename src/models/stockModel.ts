import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IStock } from '../interfaces/IStock';
import { Producto } from './productoModel';
import { Bodega } from './bodegaModel';
import { Ubicacion } from './ubicacionModel';

export class Stock extends Model<IStock> implements IStock {
    public idStock?: number;
    public idProducto!: number;
    public idBodega!: number;
    public idUbicacion!: number;
    public stock!: number;
    public pesoTotal!: number;
    public estado?: boolean;
    public producto?: Producto | undefined;
    public bodega?: Bodega | undefined;
    public ubicacion?: Ubicacion | undefined;
}

Stock.init(
    {
        idStock: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idProducto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'productos',
                key: 'idProducto'
            }
        },
        idBodega: {
            type: DataTypes.INTEGER,
            references: {
                model: 'bodegas',
                key: 'idBodega'
            }
        },
        idUbicacion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ubicaciones',
                key: 'idUbicacion'
            }
        },
        stock: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        pesoTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'stock',
        timestamps: true
    }
);

Producto.hasMany(Stock, {
    foreignKey: 'idProducto',
    as: 'stocks'
})

Bodega.hasMany(Stock, {
    foreignKey: 'idBodega',
    as: 'stocks'
})

Ubicacion.hasMany(Stock, {
    foreignKey: 'idUbicacion',
    as: 'stocks'
})

Stock.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});

Stock.belongsTo(Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});

Stock.belongsTo(Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});