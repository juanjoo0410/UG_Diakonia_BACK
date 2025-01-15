"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kardex = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const productoModel_1 = require("./productoModel");
const bodegaModel_1 = require("./bodegaModel");
const ubicacionModel_1 = require("./ubicacionModel");
class Kardex extends sequelize_1.Model {
}
exports.Kardex = Kardex;
Kardex.init({
    idKardex: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idDocumento: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    tipo: { type: sequelize_1.DataTypes.STRING(75), allowNull: false },
    detalle: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
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
    idProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'productos',
            key: 'idProducto'
        }
    },
    cantidad: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    esIngreso: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    unidades: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: db_1.default,
    tableName: 'kardex',
    timestamps: false
});
Kardex.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});
Kardex.belongsTo(ubicacionModel_1.Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});
Kardex.belongsTo(productoModel_1.Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});
