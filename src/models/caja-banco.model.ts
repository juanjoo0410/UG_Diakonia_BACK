import { DataTypes, Model } from "sequelize";
import { ICajaBanco } from "../interfaces/caja-banco.interface";
import sequelize from "../config/db";
import { Banco } from "./bancoModel";

export class CajaBanco extends Model<ICajaBanco> implements ICajaBanco {
    public id?: number;
    public codigo!: string;
    public nombre!: string;
    public numeroCuenta!: string;
    public clase!: string;
    public institucionBancariaId?: number;
    public controlaApertura!: boolean;
    public transferencia!: boolean;
    public anulado?: boolean;
}

CajaBanco.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(25), allowNull: false, unique: true },
    nombre: { type: DataTypes.STRING(75), allowNull: false },
    numeroCuenta: { type: DataTypes.STRING(50), allowNull: true },
    clase: { type: DataTypes.STRING(50), allowNull: false },
    institucionBancariaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'bancos', key: 'idBanco' }
    },
    controlaApertura: { type: DataTypes.BOOLEAN, allowNull: false },
    transferencia: { type: DataTypes.BOOLEAN, allowNull: false },
    anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    tableName: 'cajas_bancos',
    timestamps: true
});

CajaBanco.belongsTo(Banco, { foreignKey: 'institucionBancariaId', as: 'institucion_bancaria' });