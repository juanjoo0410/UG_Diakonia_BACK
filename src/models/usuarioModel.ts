import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IUsuario } from '../interfaces/IUsuario';
import { Rol } from './rolModel';

// Definimos el modelo sin usar decoradores
export class Usuario extends Model<IUsuario> implements IUsuario {
  public idUsuario?: number;
  public nombre!: string;
  public codigo!: string;
  public clave!: string;
  public idRol!: number;
  public anulado?: boolean;
}

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    codigo: {
        type: DataTypes.STRING(15),
        allowNull: false
      },
    clave: {
        type: DataTypes.STRING(75),
        allowNull: false
      },
      idRol: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'idRol'
        }
      },
    anulado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true
  }
);