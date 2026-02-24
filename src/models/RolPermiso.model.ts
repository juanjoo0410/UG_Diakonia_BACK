import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { Rol } from './rolModel';
import { IRolPermiso } from '../interfaces/rol-permiso.interface';
import { Permiso } from './Permiso.model';

// Definimos el modelo sin usar decoradores
export class RolPermiso extends Model<IRolPermiso> implements IRolPermiso {
    public idRolPermiso?: number;
    public idRol!: number;
    public idPermiso!: number;
    public rol?: Rol | undefined;
    public submenu?: Permiso | undefined;
}

RolPermiso.init(
    {
        idRolPermiso: {
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
        idPermiso: {
            type: DataTypes.INTEGER,
            references: {
                model: 'permisos',
                key: 'idPermiso'
            }
        },
    },
    {
        sequelize,
        tableName: 'roles_permisos',
        timestamps: true
    }
);