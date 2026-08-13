import { DataTypes, Model } from "sequelize";
import { ITransferenciaBancaria } from "../interfaces/transferencia-bancaria.interface";
import sequelize from "../config/db";
import { CajaBanco } from "./caja-banco.model";
import { Divisa } from "./divisa.model";
import { Usuario } from "./usuarioModel";

export class TransferenciaBancaria extends Model<ITransferenciaBancaria> implements ITransferenciaBancaria {
    public id?: number;
    public fecha!: Date;
    public tipo!: string;
    public descripcion!: string;
    public cajaBancoOrigenId!: number;
    public cajaBancoDestinoId!: number;
    public divisaId!: number;
    public valor!: number;
    public nota!: string;
    public anulado?: boolean;
    public creadorId!: number;
}

TransferenciaBancaria.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        descripcion: { type: DataTypes.STRING(200), allowNull: false },
        cajaBancoOrigenId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' }},
        cajaBancoDestinoId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' }},
        divisaId: { type: DataTypes.INTEGER, references: { model: 'divisas', key: 'id' }},
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        nota: { type: DataTypes.STRING(200), allowNull: false, },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        creadorId: { type: DataTypes.INTEGER, references: { model: 'usuarios', key: 'idUsuario' }},
    },
    {
        sequelize,
        tableName: 'transferencias_bancarias',
        timestamps: true
    }
);

TransferenciaBancaria.belongsTo(CajaBanco, {
    foreignKey: 'cajaBancoOrigenId',
    as: 'cajaBancoOrigen'
});

TransferenciaBancaria.belongsTo(CajaBanco, {
    foreignKey: 'cajaBancoDestinoId',
    as: 'cajaBancoDestino'
});

TransferenciaBancaria.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});

TransferenciaBancaria.belongsTo(Usuario, {
    foreignKey: 'creadorId',
    as: 'creador'
});