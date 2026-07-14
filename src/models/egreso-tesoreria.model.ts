import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IEgresoTesoreria } from '../interfaces/egreso-tesoreria.interface';
import { CajaBanco } from './caja-banco.model';
import { Divisa } from './divisa.model';
import { Usuario } from './usuarioModel';

export class EgresoTesoreria extends Model<IEgresoTesoreria> implements IEgresoTesoreria {
    public id?: number;
    public fecha!: Date;
    public tipo!: string;
    public descripcion!: string;
    public beneficiarioCedula?: string;
    public beneficiarioNombre?: string;
    public cajaBancoId!: number;
    public divisaId!: number;
    public cambio!: number;
    public valor!: number;
    public cajaCierreId?: number;
    public nota!: string;
    public anulado?: boolean;
    public creadorId!: number;
}

EgresoTesoreria.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        descripcion: { type: DataTypes.STRING(200), allowNull: false },
        beneficiarioCedula: { type: DataTypes.STRING(15), allowNull: true },
        beneficiarioNombre: { type: DataTypes.STRING(200), allowNull: true },
        cajaBancoId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'cajas_bancos',
                key: 'id'
            }
        },
        divisaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'divisas',
                key: 'id'
            }
        },
        cambio: { type: DataTypes.DECIMAL(18, 4), allowNull: false, },
        valor: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
        cajaCierreId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'cajas_bancos',
                key: 'id'
            }
        },
        nota: { type: DataTypes.STRING(200), allowNull: false, },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        creadorId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'usuarios',
                key: 'idUsuario'
            }
        },
    },
    {
        sequelize,
        tableName: 'egresos_tesoreria',
        timestamps: false
    }
);

EgresoTesoreria.belongsTo(CajaBanco, {
    foreignKey: 'cajaBancoId',
    as: 'cajaBanco'
});


EgresoTesoreria.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});


EgresoTesoreria.belongsTo(CajaBanco, {
    foreignKey: 'cajaCierreId',
    as: 'cajaCierre'
});


EgresoTesoreria.belongsTo(Usuario, {
    foreignKey: 'creadorId',
    as: 'creador'
});