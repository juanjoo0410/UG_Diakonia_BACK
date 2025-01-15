import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IBitacora } from '../interfaces/IBitacora';
import { IUsuario } from '../interfaces/IUsuario';
import { Usuario } from './usuarioModel';

export class Bitacora extends Model<IBitacora> implements IBitacora {
    public idBitacora?: number;
    public idUsuario!: number;
    public accion!: string;
    public entidad!: string;
    public descripcion!: string;
    public ip!: string;
    public navegador!: string;
    public fecha?: Date;
    public usuario?: IUsuario | undefined;
}

Bitacora.init(
    {
        idBitacora: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'usuarios',
                key: 'idUsuario'
            }
        },
        accion: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        entidad: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ip: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        navegador: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
    },
    {
        sequelize,
        tableName: 'bitacora',
        timestamps: false
    }
);

Bitacora.belongsTo(Usuario, {
    foreignKey: 'idUsuario',
    as: 'usuario'
});