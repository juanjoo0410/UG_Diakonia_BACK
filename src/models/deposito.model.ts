import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { CajaBanco } from "./caja-banco.model";
import { Divisa } from "./divisa.model";
import { Usuario } from "./usuarioModel";
import { IDeposito } from "../interfaces/deposito.interface";

export class Deposito extends Model<IDeposito> implements IDeposito {
    public id?: number;
    public fecha!: Date;
    public tipo!: string;
    public descripcion!: string;
    public cajaBancoId!: number;
    public cajaId!: number;
    public divisaId!: number;
    public total!: number;
    public numeroPapeleta!: string;
    public rutaPapeleta!: string;
    public nota!: string;
    public anulado?: boolean;
    public anuladoPorId?: number;
    public anuladoFecha?: Date;    
    public creadorId!: number;
}

Deposito.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        descripcion: { type: DataTypes.STRING(200), allowNull: false },
        cajaBancoId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' } },
        cajaId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' } },
        divisaId: { type: DataTypes.INTEGER, references: { model: 'divisas', key: 'id' } },
        total: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        nota: { type: DataTypes.STRING(200), allowNull: false, },
        numeroPapeleta: { type: DataTypes.STRING(50), allowNull: false, },
        rutaPapeleta: { type: DataTypes.STRING(250), allowNull: false, },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        anuladoPorId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'usuarios', key: 'idUsuario' } },
        anuladoFecha: { type: DataTypes.DATE, allowNull: true },        
        creadorId: { type: DataTypes.INTEGER, references: { model: 'usuarios', key: 'idUsuario' } },
    },
    {
        sequelize,
        tableName: 'depositos',
        timestamps: true
    }
);

Deposito.belongsTo(CajaBanco, {
    foreignKey: 'cajaBancoId',
    as: 'cajaBanco'
});

Deposito.belongsTo(CajaBanco, {
    foreignKey: 'cajaId',
    as: 'caja'
});

Deposito.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});

Deposito.belongsTo(Usuario, {
    foreignKey: 'creadorId',
    as: 'creador'
});