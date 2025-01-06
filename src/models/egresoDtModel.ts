import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { Producto } from './productoModel';
import { Bodega } from './bodegaModel';
import { Ubicacion } from './ubicacionModel';
import { IEgresoDt } from '../interfaces/IEgresoDt';
import { Egreso } from './egresoModel';

export class EgresoDt extends Model<IEgresoDt> implements EgresoDt {
    public idEgresoDt?: number;
    public idEgreso!: number;
    public idProducto!: number;
    public idBodega!: number;
    public idUbicacion!: number;
    public cantidad!: number;
    public peso!: number;
    public estado?: boolean;
    public egreso?: Egreso | undefined;
    public producto?: Producto | undefined;
    public bodega?: Bodega | undefined;
    public ubicacion?: Ubicacion | undefined;
}

EgresoDt.init(
    {
        idEgresoDt: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idEgreso: {
            type: DataTypes.INTEGER,
            references: {
                model: 'egresos',
                key: 'idEgreso'
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
        tableName: 'egresos_dt',
        timestamps: false
    }
);

Egreso.hasMany(EgresoDt, {
    foreignKey: 'idEgreso',
    as: 'egDetalles'
})

EgresoDt.belongsTo(Egreso, {
    foreignKey: 'idEgreso',
    as: 'egreso'
});

EgresoDt.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});

EgresoDt.belongsTo(Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});

EgresoDt.belongsTo(Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});