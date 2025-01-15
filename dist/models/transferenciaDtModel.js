"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferenciaDt = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const productoModel_1 = require("./productoModel");
const ubicacionModel_1 = require("./ubicacionModel");
const transferenciaModel_1 = require("./transferenciaModel");
const bodegaModel_1 = require("./bodegaModel");
class TransferenciaDt extends sequelize_1.Model {
}
exports.TransferenciaDt = TransferenciaDt;
TransferenciaDt.init({
    idTransferenciaDt: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idTransferencia: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'transferencias',
            key: 'idTransferencia'
        }
    },
    idProducto: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'productos',
            key: 'idProducto'
        }
    },
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
    idUbicacionOrigen: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'ubicaciones',
            key: 'idUbicacion'
        }
    },
    idUbicacionDestino: {
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
    tableName: 'transferencias_dt',
    timestamps: false
});
transferenciaModel_1.Transferencia.hasMany(TransferenciaDt, {
    foreignKey: 'idTransferencia',
    as: 'transfDetalles'
});
TransferenciaDt.belongsTo(transferenciaModel_1.Transferencia, {
    foreignKey: 'idTransferencia',
    as: 'transferencia'
});
TransferenciaDt.belongsTo(productoModel_1.Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
});
TransferenciaDt.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodegaOrigen',
    as: 'bodegaOrigen'
});
TransferenciaDt.belongsTo(bodegaModel_1.Bodega, {
    foreignKey: 'idBodegaDestino',
    as: 'bodegaDestino'
});
TransferenciaDt.belongsTo(ubicacionModel_1.Ubicacion, {
    foreignKey: 'idUbicacionOrigen',
    as: 'ubicacionOrigen'
});
TransferenciaDt.belongsTo(ubicacionModel_1.Ubicacion, {
    foreignKey: 'idUbicacionDestino',
    as: 'ubicacionDestino'
});
