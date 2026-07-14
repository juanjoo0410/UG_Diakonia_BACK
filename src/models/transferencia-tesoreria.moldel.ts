import { DataTypes, Model } from "sequelize";
import { ITransferenciaTesoreria } from "../interfaces/transferencia-tesoreria.interface";
import sequelize from "../config/db";
import { CajaBanco } from "./caja-banco.model";
import { Divisa } from "./divisa.model";
import { Usuario } from "./usuarioModel";

export class TransferenciaTesoreria extends Model<ITransferenciaTesoreria> implements ITransferenciaTesoreria {
    public id?: number;
    public fecha!: Date;
    public tipo!: string;
    public descripcion!: string;
    public cajaId!: number;
    public cajaBancoId!: number;
    public divisaId!: number;
    public cambio!: number;
    public valor!: number;
    public nota!: string;
    public anulado?: boolean;
    public creadorId!: number;
}

TransferenciaTesoreria.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        descripcion: { type: DataTypes.STRING(200), allowNull: false },
        cajaId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'cajas_bancos',
                key: 'id'
            }
        },
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
        tableName: 'transferencias_tesoreria',
        timestamps: false
    }
);

TransferenciaTesoreria.belongsTo(CajaBanco, {
    foreignKey: 'cajaId',
    as: 'caja'
});

TransferenciaTesoreria.belongsTo(CajaBanco, {
    foreignKey: 'cajaBancoId',
    as: 'cajaBanco'
});

TransferenciaTesoreria.belongsTo(Divisa, {
    foreignKey: 'divisaId',
    as: 'divisa'
});

TransferenciaTesoreria.belongsTo(Usuario, {
    foreignKey: 'creadorId',
    as: 'creador'
});