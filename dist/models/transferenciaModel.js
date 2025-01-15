"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transferencia = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const bodegaModel_1 = require("./bodegaModel");
class Transferencia extends sequelize_1.Model {
}
exports.Transferencia = Transferencia;
Transferencia.init({
    idTransferencia: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    descripcion: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
    idBodegaOrigen: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'bodegas',
            key: 'idBodega'
        }
    },
    idBodegaDestino: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'bodegas',
            key: 'idBodega'
        }
    },
    totalPeso: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'transferencias',
    timestamps: true
});
Transferencia.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodegaOrigen',
    as: 'bodegaOrigen'
});
Transferencia.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodegaDestino',
    as: 'bodegaDestino'
});
