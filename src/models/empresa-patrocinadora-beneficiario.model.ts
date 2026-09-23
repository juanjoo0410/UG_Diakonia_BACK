import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { IEmpresaPatrocinadoraBeneficiario } from "../interfaces/empresa-patrocinadora-beneficiario.interface";
import { EmpresaPatrocinadora } from "./empresa-patrocinadora.model";
import { Beneficiario } from "./beneficiarioModel";

export class EmpresaPatrocinadoraBeneficiario extends Model<IEmpresaPatrocinadoraBeneficiario> implements IEmpresaPatrocinadoraBeneficiario {
    public id?: number;
    public empresaPatrocinadoraId!: number;
    public beneficiarioId!: number;
    public anulado?: boolean;
}

EmpresaPatrocinadoraBeneficiario.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    empresaPatrocinadoraId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'empresas_patrocinadoras', key: 'id' }
    },
    beneficiarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'beneficiarios', key: 'idBeneficiario' }
    },
    anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    tableName: 'empresas_patrocinadoras_beneficiarios',
    timestamps: true
});

EmpresaPatrocinadora.hasMany(EmpresaPatrocinadoraBeneficiario, {
    foreignKey: 'empresaPatrocinadoraId',
    as: 'beneficiarios'
});

EmpresaPatrocinadoraBeneficiario.belongsTo(EmpresaPatrocinadora, {
    foreignKey: 'empresaPatrocinadoraId',
    as: 'empresa'
});

EmpresaPatrocinadoraBeneficiario.belongsTo(Beneficiario, {
    foreignKey: 'beneficiarioId',
    as: 'beneficiario'
});