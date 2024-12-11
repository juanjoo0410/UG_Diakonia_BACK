import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IRolSubmenu } from '../interfaces/IRolSubmenu';
import { Rol } from './rolModel';
import { Submenu } from './submenuModel';

// Definimos el modelo sin usar decoradores
export class RolSubmenu extends Model<IRolSubmenu> implements IRolSubmenu {
    public idRolSubmenu?: number;
    public idRol!: number;
    public idSubmenu!: number;
    public rol?: Rol | undefined;
    public submenu?: Submenu | undefined;
}

RolSubmenu.init(
    {
        idRolSubmenu: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idRol: {
            type: DataTypes.INTEGER,
            references: {
                model: 'roles',
                key: 'idRol'
            }
        },
        idSubmenu: {
            type: DataTypes.INTEGER,
            references: {
                model: 'submenus',
                key: 'idSubmenu'
            }
        },
    },
    {
        sequelize,
        tableName: 'roles_submenus',
        timestamps: true
    }
);

