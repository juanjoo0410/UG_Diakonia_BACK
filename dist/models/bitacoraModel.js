"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitacora = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const usuarioModel_1 = require("./usuarioModel");
class Bitacora extends sequelize_1.Model {
}
exports.Bitacora = Bitacora;
Bitacora.init({
    idBitacora: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'idUsuario'
        }
    },
    accion: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    entidad: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    ip: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    navegador: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    tableName: 'bitacora',
    timestamps: false
});
Bitacora.belongsTo(usuarioModel_1.Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
});
