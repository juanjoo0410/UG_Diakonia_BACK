import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IClaseTipoOrg } from '../interfaces/IClaseTipoOrg';

export class ClaseTipoOrg extends Model<IClaseTipoOrg> implements IClaseTipoOrg {
    public idClaseTipoOrg?: number;
    public nombre!: string;
    public estado?: boolean;
}

ClaseTipoOrg.init(
    {
        idClaseTipoOrg: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'clases_tipo_org',
        timestamps: true
    }
);