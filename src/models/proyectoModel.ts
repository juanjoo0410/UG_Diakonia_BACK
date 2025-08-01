import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IProyecto } from '../interfaces/IProyecto';
import { ProyectoInstitucion } from './proyectoInstitucionModel';

export class Proyecto extends Model<IProyecto> implements IProyecto {
    public idProyecto?: number;
    public codigo!: string;
    public nombre!: string;
    public descripcion!: string;
    public responsable!: string;
    public fechaInicio!: Date;
    public fechaFin?: Date;
    public indefinido!: boolean;
    public presupuesto!: number;
    public estado?: boolean;
    public proyectosInstituciones?: ProyectoInstitucion[] | undefined;
}

Proyecto.init(
    {
        idProyecto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        codigo: { type: DataTypes.STRING(9), allowNull: false },
        nombre: { type: DataTypes.STRING(150), allowNull: false },
        descripcion: { type: DataTypes.STRING(300), allowNull: false },
        responsable: { type: DataTypes.STRING(150), allowNull: false },
        fechaInicio: { type: DataTypes.DATE, allowNull: false },
        fechaFin: { type: DataTypes.DATE, allowNull: true },
        indefinido: { type: DataTypes.BOOLEAN, allowNull: false },
        presupuesto: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    },
    {
        sequelize,
        tableName: 'proyectos',
        timestamps: true
    }
);

Proyecto.hasMany(ProyectoInstitucion,{
  foreignKey: 'idProyecto',
  as: 'proyectosInstituciones'
});

ProyectoInstitucion.belongsTo(Proyecto, {
    foreignKey: 'idProyecto',
    as: 'proyecto'
});