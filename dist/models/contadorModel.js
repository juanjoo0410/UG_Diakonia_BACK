"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contador = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Contador extends sequelize_1.Model {
}
exports.Contador = Contador;
Contador.init({
    idContador: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: sequelize_1.DataTypes.STRING(20), allowNull: false },
    prefijo: { type: sequelize_1.DataTypes.STRING(6), allowNull: false },
    numFormato: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    ultimoValor: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'contadores',
    timestamps: true
});
