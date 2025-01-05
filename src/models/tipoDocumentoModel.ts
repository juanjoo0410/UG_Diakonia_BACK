import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITipoDocumento } from '../interfaces/ITipoDocumento';

export class TipoDocumento extends Model<ITipoDocumento> implements ITipoDocumento {
    public idTipoDocumento?: number;
    public nombre!: string;
    public ingreso!: boolean;
    public egreso!: boolean;
    public estado?: boolean;
}

TipoDocumento.init(
    {
        idTipoDocumento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        ingreso: { type: DataTypes.BOOLEAN, allowNull: false },
        egreso: { type: DataTypes.BOOLEAN, allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'tipos_documento',
        timestamps: true
    }
);