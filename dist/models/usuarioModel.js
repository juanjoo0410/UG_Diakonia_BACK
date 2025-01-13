"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
// Definimos el modelo sin usar decoradores
class Usuario extends sequelize_1.Model {
}
exports.Usuario = Usuario;
Usuario.init({
    idUsuario: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(75),
        allowNull: false
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false
    },
    clave: {
        type: sequelize_1.DataTypes.STRING(75),
        allowNull: false
    },
    correo: {
        type: sequelize_1.DataTypes.STRING(75),
        allowNull: false
    },
    cambiarClave: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    idRol: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'idRol'
        }
    },
    anulado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.default,
    tableName: 'usuarios',
    timestamps: true
});
