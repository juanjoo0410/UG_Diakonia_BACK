import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IRol } from '../interfaces/IRol';

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
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: true
  }
);