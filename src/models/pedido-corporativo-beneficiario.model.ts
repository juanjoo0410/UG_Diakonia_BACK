import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { PedidoCorporativo } from "./pedido-corporativo.model";
import { IPedidoCorporativoBeneficiario } from "../interfaces/pedido-corporativo-beneficiario.interface";
import { Beneficiario } from "./beneficiarioModel";

export class PedidoCorporativoBeneficiario extends Model<IPedidoCorporativoBeneficiario> implements IPedidoCorporativoBeneficiario {
    public id?: number;
    public pedidoCorporativoId!: number;
    public beneficiarioId!: number;
    public anulado?: boolean;
}

PedidoCorporativoBeneficiario.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        pedidoCorporativoId: { type: DataTypes.INTEGER, references: { model: 'pedidos_corporativos', key: 'id' } },
        beneficiarioId: { type: DataTypes.INTEGER, references: { model: 'beneficiarios', key: 'idBeneficiario' } },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
        sequelize,
        tableName: 'pedidos_corporativos_beneficiarios',
        timestamps: false
    }
);

PedidoCorporativo.hasMany(PedidoCorporativoBeneficiario, { foreignKey: 'pedidoCorporativoId', as: 'beneficiarios' });
PedidoCorporativoBeneficiario.belongsTo(PedidoCorporativo, { foreignKey: 'pedidoCorporativoId', as: 'pedidoCorporativo' });
PedidoCorporativoBeneficiario.belongsTo(Beneficiario, { foreignKey: 'beneficiarioId', as: 'beneficiario' });