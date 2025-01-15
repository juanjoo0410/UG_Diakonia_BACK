"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Cliente extends sequelize_1.Model {
}
exports.Cliente = Cliente;
Cliente.init({
    idCliente: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(7), allowNull: false },
    identificacion: { type: sequelize_1.DataTypes.STRING(13), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    estadoCivil: { type: sequelize_1.DataTypes.STRING(15), allowNull: false },
    sexo: { type: sequelize_1.DataTypes.STRING(1), allowNull: false },
    direccion: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
    telefono: { type: sequelize_1.DataTypes.STRING(25), allowNull: false },
    correo: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    esEmpleado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'clientes',
    timestamps: true
});
