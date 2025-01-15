"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bodega = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Bodega extends sequelize_1.Model {
}
exports.Bodega = Bodega;
Bodega.init({
    idBodega: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(25), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    tipoProducto: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
    responsable: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    venta: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    averiados: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'bodegas',
    timestamps: true
});
