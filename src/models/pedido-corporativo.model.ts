import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";
import { CajaBanco } from './caja-banco.model';
import { Usuario } from './usuarioModel';
import { IPedidoCorporativo } from '../interfaces/pedido-corporativo.interface';
import { EmpresaPatrocinadora } from './empresa-patrocinadora.model';

export class PedidoCorporativo extends Model<IPedidoCorporativo> implements IPedidoCorporativo {
    public id?: number;
    public fecha!: Date;
    public tipo!: string;
    public descripcion!: string;
    public empresaPatrocinadoraId!: number;
    public tipoPago!: string;
    public banco!: string;
    public subtotal!: number;
    public descuento!: number;
    public valorCupon!: number;
    public diferenciaEfectivo!: number;
    public total!: number;
    public totalPeso!: number;
    public usuario!: string;
    public nota!: string;
    public anulado?: boolean;
    public anuladoPorId?: number;
    public anuladoFecha?: Date;
    public creadorId!: number;
    public cajaId?: number;
    public bancoTransferenciaId?: number;
}

PedidoCorporativo.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW, },
        tipo: { type: DataTypes.STRING(25), allowNull: false },
        descripcion: { type: DataTypes.STRING(200), allowNull: false },
        empresaPatrocinadoraId: { type: DataTypes.INTEGER, references: { model: 'empresas_patrocinadoras', key: 'id' } },
        tipoPago: { type: DataTypes.STRING(25), allowNull: false },
        banco: { type: DataTypes.STRING(75), allowNull: false, },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        descuento: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        valorCupon: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        diferenciaEfectivo: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        totalPeso: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        usuario: { type: DataTypes.STRING(75), allowNull: false, },
        nota: { type: DataTypes.STRING(200), allowNull: false, },
        anulado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        anuladoPorId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'usuarios', key: 'idUsuario' } },
        anuladoFecha: { type: DataTypes.DATE, allowNull: true },
        creadorId: { type: DataTypes.INTEGER, references: { model: 'usuarios', key: 'idUsuario' } },
        cajaId: { type: DataTypes.INTEGER, references: { model: 'cajas_bancos', key: 'id' } },
        bancoTransferenciaId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'cajas_bancos', key: 'id' } },
    },
    {
        sequelize,
        tableName: 'pedidos_corporativos',
        timestamps: true
    }
);

PedidoCorporativo.belongsTo(EmpresaPatrocinadora, { foreignKey: 'empresaPatrocinadoraId', as: 'empresaPatrocinadora' });
PedidoCorporativo.belongsTo(Usuario, { foreignKey: 'anuladoPorId', as: 'anuladoPor' });
PedidoCorporativo.belongsTo(Usuario, { foreignKey: 'creadorId', as: 'creador' });
PedidoCorporativo.belongsTo(CajaBanco, { foreignKey: 'cajaId', as: 'caja' });
PedidoCorporativo.belongsTo(CajaBanco, { foreignKey: 'bancoTransferenciaId', as: 'bancoTransferencia' });