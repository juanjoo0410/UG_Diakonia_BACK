import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IParametro } from '../interfaces/IParametro';

export class Parametro extends Model<IParametro> implements IParametro {
  public idParametro?: number;
  public codigo!: string;
  public descripcion!: string;
  public valor!: string;
  public estado?: boolean;
}

Parametro.init(
  {
    idParametro: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    codigo: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    valor: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'parametros',
    timestamps: true
  }
);