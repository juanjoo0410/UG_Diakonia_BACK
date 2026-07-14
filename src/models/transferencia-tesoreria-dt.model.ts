import { DataTypes, Model } from "sequelize";
import { ITransferenciaTesoreriaDt } from "../interfaces/transferencia-tesoreria-dt.interface";
import sequelize from "../config/db";
import { TransferenciaTesoreria } from "./transferencia-tesoreria.moldel";
import { Divisa } from "./divisa.model";

export class TransferenciaTesoreriaDt extends Model<ITransferenciaTesoreriaDt> implements ITransferenciaTesoreriaDt {
    public id?: number;
    public transferenciaTesoreriaId!: number;
    public documentoId!: number;
    public tipo!: string;
    public divisaId!: number;
    public cambio!: number;
    public valor!: number;
}

TransferenciaTesoreriaDt.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        transferenciaTesoreriaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'transferencias_tesoreria',
                key: 'id'
            }
        },
        documentoId: { type: DataTypes.INTEGER, allowNull: false },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        divisaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'divisas',
                key: 'id'
            }
        },
        cambio: { type: DataTypes.DECIMAL(18, 4), allowNull: false },
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
    },
    {
        sequelize,
        tableName: 'transferencias_tesoreria_dt',
        timestamps: false
    }
);

TransferenciaTesoreria.hasMany(TransferenciaTesoreriaDt, {
    foreignKey: 'transferenciaTesoreriaId',
    as: 'detalles'
})

TransferenciaTesoreriaDt.hasMany(TransferenciaTesoreria, {
    foreignKey: 'transferenciaTesoreriaId',
    as: 'transferencia'
})

TransferenciaTesoreriaDt.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});