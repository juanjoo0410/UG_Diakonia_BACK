import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ICategoria } from '../interfaces/ICategoria';
import { GrupoProducto } from './grupoProductoModel';
import { SubgrupoProducto } from './subgrupoProductoModel';

export class Categoria extends Model<ICategoria> implements ICategoria {
    public idCategoria?: number;
    public codigo!: string;
    public nombre!: string;
    public idGrupoProducto!: number;
    public idSubgrupoProducto!: number;
    public estado?: boolean;
    public grupoProducto?: GrupoProducto | undefined;
    public subgrupoProducto?: SubgrupoProducto | undefined;
}

Categoria.init(
    {
        idCategoria: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        nombre: { type: DataTypes.STRING(75), allowNull: false },
        idGrupoProducto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'grupos_producto',
                key: 'idGrupoProducto'
            }
        },
        idSubgrupoProducto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'subgrupos_producto',
                key: 'idSubgrupoProducto'
            }
        },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'categorias',
        timestamps: true
    }
);

Categoria.belongsTo(GrupoProducto, {
    foreignKey: 'idGrupoProducto',
    as: 'grupoProducto'
});

Categoria.belongsTo(SubgrupoProducto, {
    foreignKey: 'idSubgrupoProducto',
    as: 'subgrupoProducto'
});