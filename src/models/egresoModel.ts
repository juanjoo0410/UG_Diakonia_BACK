import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { TipoDocumento } from './tipoDocumentoModel';
import { IEgreso } from '../interfaces/IEgreso';

export class Egreso extends Model<IEgreso> implements IEgreso {
    public idEgreso?: number;
    public idTipoDocumento!: number;
    public descripcion!: string;
    public idBeneficiario!: number
    public totalPeso!: number;
    public estado?: boolean;
    public tipoDocumento?: TipoDocumento | undefined;
}

Egreso.init(
    {
        idEgreso: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idTipoDocumento: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_documento',
                key: 'idTipoDocumento'
            }
        },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        idBeneficiario: { type: DataTypes.INTEGER, allowNull: false },
        totalPeso: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'egresos',
        timestamps: true
    }
);

Egreso.belongsTo(TipoDocumento, {
    foreignKey: 'idTipoDocumento',
    as: 'tipoDocumento'
});