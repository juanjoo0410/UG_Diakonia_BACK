"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submenu = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const rolSubmenuModel_1 = require("./rolSubmenuModel");
// Definimos el modelo sin usar decoradores
class Submenu extends sequelize_1.Model {
}
exports.Submenu = Submenu;
Submenu.init({
    idSubmenu: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idMenu: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'menus',
            key: 'idMenu'
        }
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    ruta: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    anulado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    sequelize: db_1.default,
    tableName: 'submenus',
    timestamps: true
});
Submenu.hasMany(rolSubmenuModel_1.RolSubmenu, {
    foreignKey: 'idSubmenu',
    as: 'roles_submenus'
});
rolSubmenuModel_1.RolSubmenu.belongsTo(Submenu, {
    foreignKey: 'idSubmenu',
    as: 'submenu'
});
