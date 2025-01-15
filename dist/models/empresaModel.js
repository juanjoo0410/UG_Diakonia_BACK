"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empresa = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Empresa extends sequelize_1.Model {
}
exports.Empresa = Empresa;
Empresa.init({
    idEmpresa: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ruc: { type: sequelize_1.DataTypes.STRING(13), allowNull: false },
    razonSocial: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
    representanteLegal: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    direccion: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
    telefono: { type: sequelize_1.DataTypes.STRING(25), allowNull: false },
    rutaLogo: { type: sequelize_1.DataTypes.STRING(300), allowNull: false },
    obligadoContabilidad: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    estado: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
    sequelize: db_1.default,
    tableName: 'empresa',
    timestamps: true
});
