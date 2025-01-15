"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const productoModel_1 = require("./productoModel");
const bodegaModel_1 = require("./bodegaModel");
const ubicacionModel_1 = require("./ubicacionModel");
class Stock extends sequelize_1.Model {
}
exports.Stock = Stock;
Stock.init({
    idStock: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
    stock: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    pesoTotal: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'stock',
    timestamps: true
});
productoModel_1.Producto.hasMany(Stock, {
    foreignKey: 'idProducto',
    as: 'stocks'
});
bodegaModel_1.Bodega.hasMany(Stock, {
    foreignKey: 'idBodega',
    as: 'stocks'
});
ubicacionModel_1.Ubicacion.hasMany(Stock, {
    foreignKey: 'idUbicacion',
    as: 'stocks'
});
Stock.belongsTo(productoModel_1.Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});
Stock.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});
Stock.belongsTo(ubicacionModel_1.Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});
