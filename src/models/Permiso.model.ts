import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IPermiso } from '../interfaces/permiso.interface';
import { RolPermiso } from './RolPermiso.model';

export class Permiso extends Model<IPermiso> implements IPermiso {
    public idPermiso!: number;
    public codigo!: string;
    public anulado?: boolean;
}

Permiso.init(
    {
        idPermiso: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
        codigo: { type: DataTypes.STRING(50), allowNull: false },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
        sequelize,
        tableName: 'permisos',
        timestamps: true
    }
);

Permiso.hasMany(RolPermiso, {
    foreignKey: 'idPermiso',
    as: 'roles_permisos'
});

RolPermiso.belongsTo(Permiso, {
    foreignKey: 'idPermiso',
    as: 'permiso'
});