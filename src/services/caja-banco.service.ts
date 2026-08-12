import { col, fn, QueryTypes, Transaction } from "sequelize";
import { ICajaBanco } from "../interfaces/caja-banco.interface";
import { CajaBanco } from "../models/caja-banco.model";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { ComprobanteVenta } from "../models/comprobanteVentaModel";
import { EgresoTesoreria } from "../models/egreso-tesoreria.model";

type CajaBancoCreationData = Omit<ICajaBanco, 'id' | 'anulado'>;

export class CajaBancoService extends BaseCRUDService<CajaBanco> {
    constructor() {
        super(CajaBanco);
    }

    public async createCajaBanco(cajaBancoData: CajaBancoCreationData): Promise<CajaBanco> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { nombre: cajaBancoData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            const newCajaBanco = await this.ModelClass.create(cajaBancoData, { transaction });
            await transaction.commit();
            return newCajaBanco;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateCajaBanco(cajaBancoData: ICajaBanco): Promise<CajaBanco> {
        const cajaBancoToUpdate = await this.ModelClass.findByPk(cajaBancoData.id);
        if (!cajaBancoToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

        if (cajaBancoData.nombre.toLocaleUpperCase() !== cajaBancoToUpdate.nombre.toLocaleUpperCase()) {
            const nameExist = await this.ModelClass.findOne({
                where: { nombre: cajaBancoData.nombre }
            });

            if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
        }

        cajaBancoToUpdate.codigo = cajaBancoData.codigo;
        cajaBancoToUpdate.nombre = cajaBancoData.nombre;
        cajaBancoToUpdate.numeroCuenta = cajaBancoData.numeroCuenta;
        cajaBancoToUpdate.clase = cajaBancoData.clase;
        cajaBancoToUpdate.controlaApertura = cajaBancoData.controlaApertura;
        cajaBancoToUpdate.transferencia = cajaBancoData.transferencia;
        const updatedCajaBanco = await cajaBancoToUpdate.save();

        return updatedCajaBanco;
    }

    public async updateCajaBancoStatus(id: number | string): Promise<CajaBanco> {
        const cajaBanco = await this.ModelClass.findByPk(id);
        if (!cajaBanco) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (cajaBanco.anulado) newStatus = false;

        cajaBanco.anulado = newStatus;
        const updatedCajaBanco = await cajaBanco.save();

        return updatedCajaBanco;
    }

    public async getEfectivoDisponibleByCajaId(cajaId: number): Promise<number> {
        try {
            let efectivoDisponible: number = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const fechaFormateada = today.toISOString().split('T')[0];

            const caja = await this.ModelClass.findByPk(cajaId);
            if (!caja) return efectivoDisponible;

            if (caja.controlaApertura) {
                const sumComprobantesResult = await ComprobanteVenta.findOne({
                    attributes: [[fn('SUM', col('total')), 'totalIngresos']],
                    where: {
                        cajaId: cajaId,
                        tipoPago: 'Efectivo',
                        fecha: fechaFormateada,
                        estado: true
                    },
                    raw: true
                }) as any;

                const sumEgresosResult = await EgresoTesoreria.findOne({
                    attributes: [[fn('SUM', col('valor')), 'totalEgresos']],
                    where: {
                        cajaBancoId: cajaId,
                        fecha: fechaFormateada,
                        anulado: false
                    },
                    raw: true
                }) as any;

                const totalIngresos = Number(sumComprobantesResult?.totalIngresos) || 0;
                const totalEgresos = Number(sumEgresosResult?.totalEgresos) || 0;
                efectivoDisponible = totalIngresos - totalEgresos;
            }
            else {
                const resultado = await sequelize.query<{ saldo: number }>(
                    `SELECT fn_ObtenerSaldoCajaBanco(:cajaId, :fecha) AS saldo`,
                    {
                        replacements: { cajaId, fecha: fechaFormateada },
                        type: QueryTypes.SELECT,
                        plain: true
                    }
                );
  
                efectivoDisponible = Number(resultado?.saldo ?? 0);;
            }

            return Number(efectivoDisponible.toFixed(2));
        } catch (error) {
            console.error('Error al calcular el efectivo disponible:', error);
            throw error;
        }
    }
}