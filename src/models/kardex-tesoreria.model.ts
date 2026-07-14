import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { CajaBanco } from "./caja-banco.model";
import { IKardexTesoreria } from "../interfaces/kardex-tesoreria.interface";

export class KardexTesoreria extends Model<IKardexTesoreria> implements IKardexTesoreria {
    public id?: number;
    public cajaBancoId!: number;
    public documentoId!: number;
    public numero!: string;
    public fecha!: Date;
    public tipo!: string;
    public descripcion!: string;
    public tipoValor!: string;    
    public esDebito!: boolean;
    public valor!: number; 
}

KardexTesoreria.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cajaBancoId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' } },
    documentoId: { type: DataTypes.INTEGER, allowNull: false },
    numero: { type: DataTypes.STRING(10), allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    tipo: { type: DataTypes.STRING(25), allowNull: false },
    descripcion: { type: DataTypes.STRING(200), allowNull: false },
    tipoValor: { type: DataTypes.STRING(25), allowNull: false },
    esDebito: { type: DataTypes.BOOLEAN, allowNull: false },
    valor: { type: DataTypes.DECIMAL(18,2), allowNull: false },
}, {
    sequelize,
    tableName: 'kardex_tesoreria',
    timestamps: true
});

KardexTesoreria.belongsTo(CajaBanco, { foreignKey: 'cajaBancoId', as: 'caja' });