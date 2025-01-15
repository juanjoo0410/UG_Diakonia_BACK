"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ubicacion = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const bodegaModel_1 = require("./bodegaModel");
class Ubicacion extends sequelize_1.Model {
}
exports.Ubicacion = Ubicacion;
Ubicacion.init({
    idUbicacion: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(15), allowNull: false },
    idBodega: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'bodegas',
            key: 'idBodega'
        }
    },
    capacidadMaxima: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'ubicaciones',
    timestamps: true
});
Ubicacion.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});
