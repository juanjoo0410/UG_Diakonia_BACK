import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ISubmenu } from '../interfaces/ISubmenu';
import { Menu } from './menuModel';

// Definimos el modelo sin usar decoradores
export class Submenu extends Model<ISubmenu> implements ISubmenu {
    public idSubmenu?: number;
    public idMenu!: number;
    public nombre!: string;
    public ruta!: string;
    public orden!: number;
    public anulado?: boolean;
    public menu?: Menu | undefined;
}

Submenu.init(
    {
        idSubmenu: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idMenu: {
            type: DataTypes.INTEGER,
            references: {
                model: 'menus',
                key: 'idMenu'
            }
        },
        nombre: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        ruta: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        orden: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        anulado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    },
    {
        sequelize,
        tableName: 'submenus',
        timestamps: true
    }
);

