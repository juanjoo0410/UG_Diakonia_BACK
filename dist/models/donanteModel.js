"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donante = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Donante extends sequelize_1.Model {
}
exports.Donante = Donante;
Donante.init({
    idDonante: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(6), allowNull: false },
    identificacion: { type: sequelize_1.DataTypes.STRING(13), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(150), allowNull: false },
    tipoPersona: { type: sequelize_1.DataTypes.STRING(10), allowNull: false },
    direccion: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
    telefono: { type: sequelize_1.DataTypes.STRING(25), allowNull: false },
    correo: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    nombreContacto: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    abreviatura: { type: sequelize_1.DataTypes.STRING(15), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'donantes',
    timestamps: true
});
