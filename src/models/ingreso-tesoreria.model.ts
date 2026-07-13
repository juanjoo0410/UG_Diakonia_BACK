import { DataTypes, Model } from "sequelize";
import { IIngresoTesoreria } from "../interfaces/ingreso-tesoreria.interface";
import sequelize from "../config/db";
import { CajaBanco } from "./caja-banco.model";
import { Divisa } from "./divisa.model";
import { Usuario } from "./usuarioModel";

export class IngresoTesoreria extends Model<IIngresoTesoreria> implements IIngresoTesoreria {
    public id?: number;
    public fecha!: Date;
    public tipo!: string;
    public descripcion!: string;
    public cajaBancoId!: number;
    public divisaId!: number;
    public cambio!: number;
    public valor!: number;
    public cajaCierreId?: number;
    public nota!: string;
    public anulado?: boolean;
    public creadorId!: number;
}

IngresoTesoreria.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        descripcion: { type: DataTypes.STRING(200), allowNull: false },
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
        tableName: 'ingresos_tesoreria',
        timestamps: false
    }
);

IngresoTesoreria.belongsTo(CajaBanco, {
    foreignKey: 'cajaBancoId',
    as: 'cajaBanco'
});


IngresoTesoreria.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});


IngresoTesoreria.belongsTo(CajaBanco, {
    foreignKey: 'cajaCierreId',
    as: 'cajaCierre'
});


IngresoTesoreria.belongsTo(Usuario, {
    foreignKey: 'creadorId',
    as: 'creador'
});