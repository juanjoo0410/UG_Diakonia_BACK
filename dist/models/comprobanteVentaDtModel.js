"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprobanteVentaDt = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const productoModel_1 = require("./productoModel");
const comprobanteVentaModel_1 = require("./comprobanteVentaModel");
const bodegaModel_1 = require("./bodegaModel");
const ubicacionModel_1 = require("./ubicacionModel");
class ComprobanteVentaDt extends sequelize_1.Model {
}
exports.ComprobanteVentaDt = ComprobanteVentaDt;
ComprobanteVentaDt.init({
    idComprobanteVentaDt: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idComprobanteVenta: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'comprobantes_venta',
            key: 'idComprobanteVenta'
        }
    },
    idProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'productos',
            key: 'idProducto'
        }
    },
    idBodega: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'bodegas',
            key: 'idBodega'
        }
    },
    idUbicacion: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'ubicaciones',
            key: 'idUbicacion'
        }
    },
    cantidad: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    precioUnd: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    total: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    peso: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'comprobantes_venta_dt',
    timestamps: false
});
comprobanteVentaModel_1.ComprobanteVenta.hasMany(ComprobanteVentaDt, {
    foreignKey: 'idComprobanteVenta',
    as: 'comvenDetalles'
});
ComprobanteVentaDt.belongsTo(comprobanteVentaModel_1.ComprobanteVenta, {
    foreignKey: 'idComprobanteVenta',
    as: 'comprobanteVenta'
});
ComprobanteVentaDt.belongsTo(productoModel_1.Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});
ComprobanteVentaDt.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});
ComprobanteVentaDt.belongsTo(ubicacionModel_1.Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});
