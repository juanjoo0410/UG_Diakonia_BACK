import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { IBeneficiarioProyecto } from "../interfaces/beneficiario-proyecto.interface";
import { EstadoCivil } from "./estado-civil.model";
import { AutoidentificacionEtnica } from "./autoidentificacion-etnica.model";

export class BeneficiarioProyecto extends Model<IBeneficiarioProyecto> implements IBeneficiarioProyecto {
    public id?: number;
    public codigo!: string;
    public esExtranjero!: boolean;
    public identificacion!: string;
    public nombres!: string;
    public apellidos!: string;
    public sexo!: string;
    public fechaNacimiento!: Date;
    public estadoCivilId!: number;
    public ocupacion!: string;
    public autoidentificacionEtnicaId!: number;
    public esDiscapacitado!: boolean;
    public anulado?: boolean;
}

BeneficiarioProyecto.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        esExtranjero: { type: DataTypes.BOOLEAN, allowNull: false },
        identificacion: { type: DataTypes.STRING(15), allowNull: false },
        nombres: { type: DataTypes.STRING(150), allowNull: false },
        apellidos: { type: DataTypes.STRING(150), allowNull: false },
        sexo: { type: DataTypes.STRING(1), allowNull: false },
        fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: false },
        estadoCivilId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'estados_civil', key: 'id' } },
        ocupacion: { type: DataTypes.STRING(150), allowNull: false },
        autoidentificacionEtnicaId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'autoidentificaciones_etnicas', key: 'id' } },
        esDiscapacitado: { type: DataTypes.BOOLEAN, allowNull: false },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    },
    {
        sequelize,
        tableName: 'beneficiarios_proyectos',
        timestamps: true
    }
);

BeneficiarioProyecto.belongsTo(EstadoCivil, { foreignKey: 'estadoCivilId', as: 'estadoCivil' });
BeneficiarioProyecto.belongsTo(AutoidentificacionEtnica, { foreignKey: 'autoidentificacionEtnicaId', as: 'autoidentificacionEtnica' });