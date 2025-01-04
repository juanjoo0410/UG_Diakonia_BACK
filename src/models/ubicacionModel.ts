import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IUbicacion } from '../interfaces/IUbicacion';
import { Bodega } from './bodegaModel';

export class Ubicacion extends Model<IUbicacion> implements IUbicacion {
    public idUbicacion?: number;
    public codigo!: string;
    public idBodega!: number;
    public capacidadMaxima!: number;
    public estado?: boolean;
    public bodega?: Bodega | undefined;
}

Ubicacion.init(
    {
        idUbicacion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(15), allowNull: false },
        idBodega: {
            type: DataTypes.INTEGER,
            references: {
                model: 'bodegas',
                key: 'idBodega'
            }
        },
        capacidadMaxima: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'ubicaciones',
        timestamps: true
    }
);

Ubicacion.belongsTo(Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});