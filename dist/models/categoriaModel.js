"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categoria = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const grupoProductoModel_1 = require("./grupoProductoModel");
const subgrupoProductoModel_1 = require("./subgrupoProductoModel");
class Categoria extends sequelize_1.Model {
}
exports.Categoria = Categoria;
Categoria.init({
    idCategoria: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(6), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(75), allowNull: false },
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
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'categorias',
    timestamps: true
});
Categoria.belongsTo(grupoProductoModel_1.GrupoProducto, {
    foreignKey: 'idGrupoProducto',
    as: 'grupoProducto'
});
Categoria.belongsTo(subgrupoProductoModel_1.SubgrupoProducto, {
    foreignKey: 'idSubgrupoProducto',
    as: 'subgrupoProducto'
});
