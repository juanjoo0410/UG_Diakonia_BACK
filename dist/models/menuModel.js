"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Menu = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const submenuModel_1 = require("./submenuModel");
// Definimos el modelo sin usar decoradores
class Menu extends sequelize_1.Model {
}
exports.Menu = Menu;
Menu.init({
    idMenu: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    icono: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    ruta: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: true
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    anulado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.default,
    tableName: 'menus',
    timestamps: true
});
Menu.hasMany(submenuModel_1.Submenu, {
    foreignKey: 'idMenu',
    sourceKey: 'idMenu',
    as: 'submenus'
});
submenuModel_1.Submenu.belongsTo(Menu, {
    foreignKey: 'idMenu',
    targetKey: 'idMenu',
    as: 'menu'
});
