"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolSubmenu = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
// Definimos el modelo sin usar decoradores
class RolSubmenu extends sequelize_1.Model {
}
exports.RolSubmenu = RolSubmenu;
RolSubmenu.init({
    idRolSubmenu: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idRol: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'idRol'
        }
    },
    idSubmenu: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'submenus',
            key: 'idSubmenu'
        }
    },
}, {
    sequelize: db_1.default,
    tableName: 'roles_submenus',
    timestamps: true
});
