"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoPoblacion = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class TipoPoblacion extends sequelize_1.Model {
}
exports.TipoPoblacion = TipoPoblacion;
TipoPoblacion.init({
    idTipoPoblacion: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(9), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    descripcion: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'tipos_poblacion',
    timestamps: true
});
