"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const categoriaModel_1 = require("./categoriaModel");
const grupoProductoModel_1 = require("./grupoProductoModel");
const subgrupoProductoModel_1 = require("./subgrupoProductoModel");
class Producto extends sequelize_1.Model {
}
exports.Producto = Producto;
Producto.init({
    idProducto: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(5), allowNull: false },
    descripcion: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    idGrupoProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'grupos_producto',
            key: 'idGrupoProducto'
        }
    },
    idSubgrupoProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'subgrupos_producto',
            key: 'idSubgrupoProducto'
        }
    },
    idCategoria: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'categorias',
            key: 'idCategoria'
        }
    },
    prest: { type: sequelize_1.DataTypes.STRING(15), allowNull: false },
    unidadesPorPrest: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    pesoPorUnidad: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    unidadPeso: { type: sequelize_1.DataTypes.STRING(5), allowNull: false },
    lote: { type: sequelize_1.DataTypes.STRING(25), allowNull: true },
    fechaCaducidad: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    precioCosto: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    precioTiendita: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    sku: { type: sequelize_1.DataTypes.STRING(75), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'productos',
    timestamps: true
});
Producto.belongsTo(grupoProductoModel_1.GrupoProducto, {
    foreignKey: 'idGrupoProducto',
    as: 'grupoProducto'
});
Producto.belongsTo(subgrupoProductoModel_1.SubgrupoProducto, {
    foreignKey: 'idSubgrupoProducto',
    as: 'subgrupoProducto'
});
Producto.belongsTo(categoriaModel_1.Categoria, {
    foreignKey: 'idCategoria',
    as: 'categoria'
});
