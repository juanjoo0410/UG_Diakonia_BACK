import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IKardex } from '../interfaces/IKardex';
import { Producto } from './productoModel';
import { Bodega } from './bodegaModel';
import { Ubicacion } from './ubicacionModel';

export class Kardex extends Model<IKardex> implements IKardex {
    public idKardex?: number;
    public idDocumento!: number;
    public tipo!: string;
    public detalle!: string;
    public idBodega!: number;
    public idUbicacion!: number;
    public idProducto!: number;
    public cantidad!: number;
    public esIngreso!: boolean;
    public unidades!: number;
    public producto?: Producto | undefined;
}

Kardex.init(
    {
        idKardex: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idDocumento: { type: DataTypes.INTEGER, allowNull: false },
        tipo: { type: DataTypes.STRING(75), allowNull: false },
        detalle: { type: DataTypes.STRING(500), allowNull: false },
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
        idProducto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'productos',
                key: 'idProducto'
            }
        },
        cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        esIngreso: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        unidades: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    },
    {
        sequelize,
        tableName: 'kardex',
        timestamps: true
    }
);

Kardex.belongsTo(Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});

Kardex.belongsTo(Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});

Kardex.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});