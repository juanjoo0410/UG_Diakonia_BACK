import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IProducto } from '../interfaces/IProducto';
import { Categoria } from './categoriaModel';
import { Donante } from './donanteModel';
import { GrupoProducto } from './grupoProductoModel';
import { SubgrupoProducto } from './subgrupoProductoModel';

export class Producto extends Model<IProducto> implements IProducto {
    public idProducto?: number;
    public codigo!: string;
    public descripcion!: string;
    public idGrupoProducto!: number;
    public idSubgrupoProducto!: number;
    public idCategoria!: number;
    public idDonante!: number;
    public prest!: string;
    public unidadesPorPrest!: number;
    public pesoPorUnidad!: number;
    public unidadPeso!: string;
    public lote!: string;
    public fechaCaducidad!: Date;
    public precioCosto!: number;
    public precioTiendita!: number;
    public sku!: string;
    public estado?: boolean;
    public grupoProducto?: GrupoProducto | undefined;
    public subgrupoProducto?: SubgrupoProducto | undefined;
    public categoria?: Categoria | undefined;
    public donante?: Donante | undefined;
}

Producto.init(
    {
        idProducto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(5), allowNull: false },
        descripcion: { type: DataTypes.STRING(100), allowNull: false },
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
        idCategoria: {
            type: DataTypes.INTEGER,
            references: {
                model: 'categorias',
                key: 'idCategoria'
            }
        },
        idDonante: { type: DataTypes.INTEGER, allowNull: true },
        prest: { type: DataTypes.STRING(15), allowNull: false },
        unidadesPorPrest: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        pesoPorUnidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        unidadPeso: { type: DataTypes.STRING(5), allowNull: false },
        lote: { type: DataTypes.STRING(25), allowNull: true },
        fechaCaducidad: { type: DataTypes.DATE, allowNull: true },
        precioCosto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        precioTiendita: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        sku: { type: DataTypes.STRING(75), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'productos',
        timestamps: true
    }
);

Producto.belongsTo(GrupoProducto, {
    foreignKey: 'idGrupoProducto',
    as: 'grupoProducto'
});

Producto.belongsTo(SubgrupoProducto, {
    foreignKey: 'idSubgrupoProducto',
    as: 'subgrupoProducto'
});

Producto.belongsTo(Categoria, {
    foreignKey: 'idCategoria',
    as: 'categoria'
});