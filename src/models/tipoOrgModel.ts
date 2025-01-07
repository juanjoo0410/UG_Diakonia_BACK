import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITipoOrg } from '../interfaces/ITipoOrg';

export class TipoOrg extends Model<ITipoOrg> implements ITipoOrg {
    public idTipoOrg?: number;
    public codigo!: string;
    public nombre!: string;
    public descripcion!: string;
    public estado?: boolean;
}

TipoOrg.init(
    {
        idTipoOrg: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'tipos_org',
        timestamps: true
    }
);