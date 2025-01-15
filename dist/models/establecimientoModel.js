"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Establecimiento = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const donanteModel_1 = require("./donanteModel");
class Establecimiento extends sequelize_1.Model {
}
exports.Establecimiento = Establecimiento;
Establecimiento.init({
    idEstablecimiento: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: sequelize_1.DataTypes.STRING(9), allowNull: false },
    nombre: { type: sequelize_1.DataTypes.STRING(13), allowNull: false },
    idDonante: { type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'donantes',
            key: 'idDonante'
        } },
    direccion: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    telefono: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'establecimientos',
    timestamps: true
});
Establecimiento.belongsTo(donanteModel_1.Donante, {
    foreignKey: 'idDonante',
    as: 'donante'
});
