import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IRol } from '../interfaces/IRol';
import { Usuario } from './usuarioModel';
import { RolSubmenu } from './rolSubmenuModel';

// Definimos el modelo sin usar decoradores
export class Rol extends Model<IRol> implements IRol {
  public idRol?: number;
  public nombre!: string;
  public anulado?: boolean;
}

Rol.init(
  {
    idRol: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    anulado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: true
  }
);

Rol.hasMany(Usuario,{
  foreignKey: 'idRol',
  as: 'usuarios'
});

Usuario.belongsTo(Rol, {
  foreignKey: 'idRol',
  as: 'rol'
});

Rol.hasMany(RolSubmenu,{
  foreignKey: 'idRol',
  as: 'roles_submenus'
});

RolSubmenu.belongsTo(Rol, {
  foreignKey: 'idRol',
  as: 'rol'
});