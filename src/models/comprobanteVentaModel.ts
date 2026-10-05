import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { IComprobanteVenta } from '../interfaces/IComprobanteVenta';
import { Beneficiario } from './beneficiarioModel';
import { CajaBanco } from './caja-banco.model';
import { EmpresaPatrocinadora } from './empresa-patrocinadora.model';
import { PedidoCorporativo } from './pedido-corporativo.model';

export class ComprobanteVenta extends Model<IComprobanteVenta> implements IComprobanteVenta {
    public idComprobanteVenta?: number;
    public idBeneficiario?: number;
    public empresaPatrocinadoraId?: number;
    public tipoPago!: string;
    public banco!: string;
    public subtotal!: number;
    public descuento!: number;
    public valorCupon!: number;
    public diferenciaEfectivo?: number;
    public total!: number;
    public totalPeso!: number;
    public usuario!: string;
    public estado?: boolean;
    public fecha?: Date;
    public cajaId?: number | undefined;
    public bancoTransferenciaId?: number | undefined;
    public beneficiario?: Beneficiario | undefined;
    public pedidoCorporativoId?: number;
}

ComprobanteVenta.init(
    {
        idComprobanteVenta: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        idBeneficiario: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'beneficiarios', key: 'idBeneficiario' } },
        empresaPatrocinadoraId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'empresas_patrocinadoras', key: 'id' } },
        tipoPago: { type: DataTypes.STRING(25), allowNull: false },
        banco: { type: DataTypes.STRING(75), allowNull: false, },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        valorCupon: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        diferenciaEfectivo: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        totalPeso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        usuario: { type: DataTypes.STRING(75), allowNull: false, },
        estado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, },
        cajaId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' } },
        bancoTransferenciaId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cajas_bancos', key: 'id' } },
        pedidoCorporativoId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'pedidos_corporativos', key: 'id' } },
    },
    {
        sequelize,
        tableName: 'comprobantes_venta',
        timestamps: true
    }
);

ComprobanteVenta.belongsTo(Beneficiario, { foreignKey: 'idBeneficiario', as: 'beneficiario' });
ComprobanteVenta.belongsTo(EmpresaPatrocinadora, { foreignKey: 'empresaPatrocinadoraId', as: 'empresaPatrocinadora' });
ComprobanteVenta.belongsTo(CajaBanco, { foreignKey: 'cajaId', as: 'caja' });
ComprobanteVenta.belongsTo(CajaBanco, { foreignKey: 'bancoTransferenciaId', as: 'bancoTransferencia' });
ComprobanteVenta.belongsTo(PedidoCorporativo, { foreignKey: 'pedidoCorporativoId', as: 'pedidoCorporativo' });