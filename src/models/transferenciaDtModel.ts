import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { Producto } from './productoModel';
import { Ubicacion } from './ubicacionModel';
import { ITransferenciaDt } from '../interfaces/ITransferenciaDt';
import { Transferencia } from './transferenciaModel';
import { Bodega } from './bodegaModel';

export class TransferenciaDt extends Model<ITransferenciaDt> implements ITransferenciaDt {
    public idTransferenciaDt?: number;
    public idTransferencia!: number;
    public idProducto!: number;
    public idBodegaOrigen!: number;
    public idBodegaDestino!: number;
    public idUbicacionOrigen!: number;
    public idUbicacionDestino!: number;
    public cantidad!: number;
    public peso!: number;
    public estado?: boolean;
    public transferencia?: Transferencia | undefined;
    public producto?: Producto | undefined;
    public bodegaOrigen?: Bodega | undefined;
    public bodegaDestino?: Bodega | undefined;
    public ubicacionOrigen?: Ubicacion | undefined;
    public ubicacionDestino?: Ubicacion | undefined;
}

TransferenciaDt.init(
    {
        idTransferenciaDt: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idTransferencia: {
            type: DataTypes.INTEGER,
            references: {
                model: 'transferencias',
                key: 'idTransferencia'
            }
        },
        idProducto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'productos',
                key: 'idProducto'
            }
        },
        idBodegaOrigen: {
            type: DataTypes.INTEGER,
            references: {
                model: 'bodegas',
                key: 'idBodega'
            }
        },
        idBodegaDestino: {
            type: DataTypes.INTEGER,
            references: {
                model: 'bodegas',
                key: 'idBodega'
            }
        },
        idUbicacionOrigen: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ubicaciones',
                key: 'idUbicacion'
            }
        },
        idUbicacionDestino: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ubicaciones',
                key: 'idUbicacion'
            }
        },
        cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        peso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'transferencias_dt',
        timestamps: false
    }
);

Transferencia.hasMany(TransferenciaDt, {
    foreignKey: 'idTransferencia',
    as: 'transfDetalles'
})

TransferenciaDt.belongsTo(Transferencia, {
    foreignKey: 'idTransferencia',
    as: 'transferencia'
});

TransferenciaDt.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});

TransferenciaDt.belongsTo(Bodega, {
    foreignKey: 'idBodegaOrigen',
    as: 'bodegaOrigen'
});

TransferenciaDt.belongsTo(Bodega, {
    foreignKey: 'idBodegaDestino',
    as: 'bodegaDestino'
});

TransferenciaDt.belongsTo(Ubicacion, {
    foreignKey: 'idUbicacionOrigen',
    as: 'ubicacionOrigen'
});

TransferenciaDt.belongsTo(Ubicacion, {
    foreignKey: 'idUbicacionDestino',
    as: 'ubicacionDestino'
});