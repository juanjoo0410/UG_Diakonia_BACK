import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IIngresoDt } from '../interfaces/IIngresoDt';
import { Ingreso } from './ingresoModel';
import { Producto } from './productoModel';
import { Bodega } from './bodegaModel';
import { Ubicacion } from './ubicacionModel';

export class IngresoDt extends Model<IIngresoDt> implements IIngresoDt {
    public idIngresoDt?: number;
    public idIngreso!: number;
    public idProducto!: number;
    public idBodega!: number;
    public idUbicacion!: number;
    public cantidad!: number;
    public peso!: number;
    public estado?: boolean;
    public ingreso?: Ingreso | undefined;
    public producto?: Producto | undefined;
    public bodega?: Bodega | undefined;
    public ubicacion?: Ubicacion | undefined;
}

IngresoDt.init(
    {
        idIngresoDt: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idIngreso: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ingresos',
                key: 'idIngreso'
            }
        },
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
        cantidad: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        peso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'ingresos_dt',
        timestamps: false
    }
);

Ingreso.hasMany(IngresoDt, {
    foreignKey: 'idIngreso',
    as: 'ingDetalles'
})

IngresoDt.belongsTo(Ingreso, {
    foreignKey: 'idIngreso',
    as: 'ingreso'
});

IngresoDt.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});

IngresoDt.belongsTo(Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});

IngresoDt.belongsTo(Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});