import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IMenu } from '../interfaces/IMenu';
import { Submenu } from './submenuModel';

// Definimos el modelo sin usar decoradores
export class Menu extends Model<IMenu> implements IMenu {
  public idMenu!: number;
  public nombre!: string;
  public icono!: string;
  public ruta?: string;
  public orden!: number;
  public anulado?: boolean;
}

Menu.init(
  {
    idMenu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    icono: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ruta: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    orden: {
      type: DataTypes.INTEGER,
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
    tableName: 'menus',
    timestamps: true
  }
);

Menu.hasMany(Submenu, {
  foreignKey: 'idMenu',
  sourceKey: 'idMenu',
  as: 'submenus'
});

Submenu.belongsTo(Menu, {
  foreignKey: 'idMenu',
  targetKey: 'idMenu',
  as: 'menu'
});