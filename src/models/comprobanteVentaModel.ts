import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IComprobanteVenta } from '../interfaces/IComprobanteVenta';
import { Beneficiario } from './beneficiarioModel';

export class ComprobanteVenta extends Model<IComprobanteVenta> implements IComprobanteVenta {
    public idComprobanteVenta?: number;
    public idBeneficiario!: number;
    public tipoPago!: string;
    public banco!: string;
    public subtotal!: number;
    public descuento!: number;
    public valorCupon!: number;
    public total!: number;
    public totalPeso!: number;
    public usuario!: string;
    public estado?: boolean;
    public fecha?: Date;
    public beneficiario?: Beneficiario | undefined;
}

ComprobanteVenta.init(
    {
        idComprobanteVenta: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idBeneficiario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'beneficiarios',
                key: 'idBeneficiario'
            }
        },
        tipoPago: { type: DataTypes.STRING(25), allowNull: false },
        banco: { type: DataTypes.STRING(75), allowNull: false, },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        valorCupon: { type: DataTypes.INTEGER, allowNull: false },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        totalPeso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        usuario: { type: DataTypes.STRING(75), allowNull: false, },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    },
    {
        sequelize,
        tableName: 'comprobantes_venta',
        timestamps: false
    }
);

ComprobanteVenta.belongsTo(Beneficiario, {
    foreignKey: 'idBeneficiario',
    as: 'beneficiario'
});