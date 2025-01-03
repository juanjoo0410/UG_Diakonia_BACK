import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { ITipoOrg } from '../interfaces/ITipoOrg';
import { ClaseTipoOrg } from './claseTipoOrgModel';

export class TipoOrg extends Model<ITipoOrg> implements ITipoOrg {
    public idTipoOrg?: number;
    public codigo!: string;
    public nombre!: string;
    public idClaseTipoOrg!: number;
    public descripcion!: string;
    public estado?: boolean;
    public claseTipoOrg?: ClaseTipoOrg | undefined;
}

TipoOrg.init(
    {
        idTipoOrg: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(100), allowNull: false },
        idClaseTipoOrg: {
            type: DataTypes.INTEGER,
            references: {
                model: 'clases_tipo_org',
                key: 'idClaseTipoOrg'
            }
        },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'tipos_org',
        timestamps: true
    }
);

TipoOrg.belongsTo(ClaseTipoOrg, {
    foreignKey: 'idClaseTipoOrg',
    as: 'claseTipoOrg'
});