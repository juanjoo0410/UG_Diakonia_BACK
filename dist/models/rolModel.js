"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rol = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const usuarioModel_1 = require("./usuarioModel");
const rolSubmenuModel_1 = require("./rolSubmenuModel");
// Definimos el modelo sin usar decoradores
class Rol extends sequelize_1.Model {
}
exports.Rol = Rol;
Rol.init({
    idRol: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(75),
        allowNull: false
    },
    anulado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.default,
    tableName: 'roles',
    timestamps: true
});
Rol.hasMany(usuarioModel_1.Usuario, {
    foreignKey: 'idRol',
    as: 'usuarios'
});
usuarioModel_1.Usuario.belongsTo(Rol, {
    foreignKey: 'idRol',
    as: 'rol'
});
Rol.hasMany(rolSubmenuModel_1.RolSubmenu, {
    foreignKey: 'idRol',
    as: 'roles_submenus'
});
rolSubmenuModel_1.RolSubmenu.belongsTo(Rol, {
    foreignKey: 'idRol',
    as: 'rol'
});
