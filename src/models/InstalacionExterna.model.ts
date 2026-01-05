import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IInstalacionExterna } from '../interfaces/instalacion-externa.interface';

export class InstalacionExterna extends Model<IInstalacionExterna> implements IInstalacionExterna {
    public idInstalacionExterna?: number;
    public codigo!: string;
    public nombre!: string;
    public estado?: boolean;
}

InstalacionExterna.init(
    {
        idInstalacionExterna: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(6), allowNull: false },
        nombre: { type: DataTypes.STRING(50), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'instalaciones_externas',
        timestamps: true
    }
);