import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITablero } from '../interfaces/tablero.interface';
import { TableroUsuario } from './tablero-usuario.model';

export class Tablero extends Model<ITablero> implements ITablero {
    public id?: number;
    public codigo!: string;
    public nombre!: string;
    public descripcion!: string;
    public url!: string;
    public todos!: boolean;
    public estado?: boolean;
    public tablerosUsuarios?: TableroUsuario[] | undefined;
}

Tablero.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        descripcion: { type: DataTypes.STRING(250), allowNull: false },
        url: { type: DataTypes.STRING(500), allowNull: false },
        todos: { type: DataTypes.BOOLEAN, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'tableros',
        timestamps: true
    }
);

Tablero.hasMany(TableroUsuario, {
    foreignKey: 'idTablero',
    as: 'tablerosUsuarios'
});

TableroUsuario.belongsTo(Tablero, {
    foreignKey: 'idTablero',
    as: 'tablero'
});