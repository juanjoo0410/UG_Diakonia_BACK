"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngresoDt = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const ingresoModel_1 = require("./ingresoModel");
const productoModel_1 = require("./productoModel");
const bodegaModel_1 = require("./bodegaModel");
const ubicacionModel_1 = require("./ubicacionModel");
class IngresoDt extends sequelize_1.Model {
}
exports.IngresoDt = IngresoDt;
IngresoDt.init({
    idIngresoDt: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idIngreso: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'ingresos',
            key: 'idIngreso'
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
    peso: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'ingresos_dt',
    timestamps: false
});
ingresoModel_1.Ingreso.hasMany(IngresoDt, {
    foreignKey: 'idIngreso',
    as: 'ingDetalles'
});
IngresoDt.belongsTo(ingresoModel_1.Ingreso, {
    foreignKey: 'idIngreso',
    as: 'ingreso'
});
IngresoDt.belongsTo(productoModel_1.Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});
IngresoDt.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});
IngresoDt.belongsTo(ubicacionModel_1.Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});
