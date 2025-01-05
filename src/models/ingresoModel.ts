import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IIngreso } from '../interfaces/IIngreso';
import { TipoDocumento } from './tipoDocumentoModel';
import { IngresoDt } from './ingresoDtModel';

export class Ingreso extends Model<IIngreso> implements IIngreso {
    public idIngreso?: number;
    public idTipoDocumento!: number;
    public descripcion!: string;
    public totalPeso!: number;
    public estado?: boolean;
    public tipoDocumento?: TipoDocumento | undefined;
}

Ingreso.init(
    {
        idIngreso: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idTipoDocumento: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tipos_documento',
                key: 'idTipoDocumento'
            }
        },
        descripcion: { type: DataTypes.STRING(500), allowNull: false },
        totalPeso: { type: DataTypes.DECIMAL(10,2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'ingresos',
        timestamps: true
    }
);

Ingreso.belongsTo(TipoDocumento, {
    foreignKey: 'idTipoDocumento',
    as: 'tipoDocumento'
});