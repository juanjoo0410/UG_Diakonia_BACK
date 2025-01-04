import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ClaseTipoOrg } from './claseTipoOrgModel';
import { ISubgrupoProducto } from '../interfaces/ISubgrupoProducto';
import { GrupoProducto } from './grupoProductoModel';

export class SubgrupoProducto extends Model<ISubgrupoProducto> implements ISubgrupoProducto {
    public idSubgrupoProducto?: number;
    public codigo!: string;
    public nombre!: string;
    public idGrupoProducto!: number;
    public estado?: boolean;
    public grupoProducto?: GrupoProducto | undefined;
}

SubgrupoProducto.init(
    {
        idSubgrupoProducto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(50), allowNull: false },
        idGrupoProducto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'grupos_producto',
                key: 'idGrupoProducto'
            }
        },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'subgrupos_producto',
        timestamps: true
    }
);

SubgrupoProducto.belongsTo(GrupoProducto, {
    foreignKey: 'idGrupoProducto',
    as: 'grupoProducto'
});