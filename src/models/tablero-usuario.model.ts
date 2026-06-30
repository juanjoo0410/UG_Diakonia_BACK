import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITableroUsuario } from '../interfaces/tablero-usuario.interface';

export class TableroUsuario extends Model<ITableroUsuario> implements ITableroUsuario {
    public id?: number;
    public idTablero!: number;
    public idUsuario!: number;
}

TableroUsuario.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idTablero: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tableros',
                key: 'id'
            }
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'usuarios',
                key: 'idUsuario'
            }
        },
    },
    {
        sequelize,
        tableName: 'tableros_usuarios',
        timestamps: true
    }
);