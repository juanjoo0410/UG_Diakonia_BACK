"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubgrupoProducto = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const grupoProductoModel_1 = require("./grupoProductoModel");
class SubgrupoProducto extends sequelize_1.Model {
}
exports.SubgrupoProducto = SubgrupoProducto;
SubgrupoProducto.init({
    idSubgrupoProducto: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(9), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    idGrupoProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'grupos_producto',
            key: 'idGrupoProducto'
        }
    },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'subgrupos_producto',
    timestamps: true
});
SubgrupoProducto.belongsTo(grupoProductoModel_1.GrupoProducto, {
    foreignKey: 'idGrupoProducto',
    as: 'grupoProducto'
});
