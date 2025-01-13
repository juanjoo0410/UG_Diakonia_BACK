"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoTransaccion = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class TipoTransaccion extends sequelize_1.Model {
}
exports.TipoTransaccion = TipoTransaccion;
TipoTransaccion.init({
    idTipoTransaccion: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    ingreso: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    egreso: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'tipos_transaccion',
    timestamps: true
});
