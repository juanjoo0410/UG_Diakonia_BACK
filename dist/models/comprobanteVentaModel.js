"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprobanteVenta = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const clienteModel_1 = require("./clienteModel");
class ComprobanteVenta extends sequelize_1.Model {
}
exports.ComprobanteVenta = ComprobanteVenta;
ComprobanteVenta.init({
    idComprobanteVenta: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idCliente: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'clientes',
            key: 'idCliente'
        }
    },
    tipoPago: { type: sequelize_1.DataTypes.STRING(25), allowNull: false },
    banco: { type: sequelize_1.DataTypes.STRING(75), allowNull: false, },
    subtotal: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    descuento: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    total: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    fecha: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW, },
}, {
    sequelize: db_1.default,
    tableName: 'comprobantes_venta',
    timestamps: false
});
ComprobanteVenta.belongsTo(clienteModel_1.Cliente, {
    foreignKey: 'idCliente',
    as: 'cliente'
});
