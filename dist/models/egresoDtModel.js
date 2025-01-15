"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EgresoDt = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const productoModel_1 = require("./productoModel");
const bodegaModel_1 = require("./bodegaModel");
const ubicacionModel_1 = require("./ubicacionModel");
const egresoModel_1 = require("./egresoModel");
class EgresoDt extends sequelize_1.Model {
}
exports.EgresoDt = EgresoDt;
EgresoDt.init({
    idEgresoDt: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idEgreso: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'egresos',
            key: 'idEgreso'
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
    tableName: 'egresos_dt',
    timestamps: false
});
egresoModel_1.Egreso.hasMany(EgresoDt, {
    foreignKey: 'idEgreso',
    as: 'egDetalles'
});
EgresoDt.belongsTo(egresoModel_1.Egreso, {
    foreignKey: 'idEgreso',
    as: 'egreso'
});
EgresoDt.belongsTo(productoModel_1.Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});
EgresoDt.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodega',
    as: 'bodega'
});
EgresoDt.belongsTo(ubicacionModel_1.Ubicacion, {
    foreignKey: 'idUbicacion',
    as: 'ubicacion'
});
