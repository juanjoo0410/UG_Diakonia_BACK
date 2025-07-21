import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IProyectoInstitucion } from '../interfaces/IProyectoInstitucion';
import { Proyecto } from './proyectoModel';
import { Institucion } from './institucionModel';

export class ProyectoInstitucion extends Model<IProyectoInstitucion> implements IProyectoInstitucion {
    public idProyectoInstitucion?: number;
    public idProyecto!: number;
    public idInstitucion!: number;
    public proyecto?: Proyecto | undefined;
    public institucion?: Institucion | undefined;
}

ProyectoInstitucion.init(
    {
        idProyectoInstitucion: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idProyecto: {
            type: DataTypes.INTEGER,
            references: {
                model: 'proyectos',
                key: 'idProyecto'
            }
        },
        idInstitucion: {
            type: DataTypes.INTEGER,
            references: {
                model: 'instituciones',
                key: 'idInstitucion'
            }
        },
    },
    {
        sequelize,
        tableName: 'proyectos_instituciones',
        timestamps: true
    }
);