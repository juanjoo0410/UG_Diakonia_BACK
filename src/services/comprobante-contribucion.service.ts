import { Transaction } from "sequelize";
import { IComprobanteVenta } from "../interfaces/IComprobanteVenta";
import { ComprobanteVenta } from "../models/comprobanteVentaModel";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { ComprobanteVentaDt } from "../models/comprobanteVentaDtModel";
import { Beneficiario } from "../models/beneficiarioModel";
import { EmpresaPatrocinadora } from "../models/empresa-patrocinadora.model";
import { FilterDto } from "../dtos/filter.dto";

type ICreationData = Omit<IComprobanteVenta, 'id' | 'estado'>;

export class ComprobanteContribucionService extends BaseCRUDService<ComprobanteVenta> {
    constructor() {
        super(ComprobanteVenta);
    }

    public async getIngresoById(id: number, transaction?: any): Promise<ComprobanteVenta> {
        const ingreso = await this.ModelClass.findByPk(id, {
            include: [{
                model: Beneficiario,
                as: 'beneficiario'
            }, {
                model: EmpresaPatrocinadora,
                as: 'empresaPatrocinadora'
            }, {
                model: ComprobanteVentaDt,
                as: 'comvenDetalles'
            }],
            transaction
        });

        if (!ingreso) throw new Error('INGRESO_NO_ENCONTRADO');
        return ingreso;
    }

    public async createComprobanteContribucion(data: ICreationData, parentTransaction?: Transaction): Promise<ComprobanteVenta> {
        const executeLogic = async (t: Transaction): Promise<ComprobanteVenta> => {
            const newComprobante = await this.ModelClass.create(data, { transaction: t });

            const comprobanteId = newComprobante.idComprobanteVenta ?? 0;
            const detallesToCreate = data.comprobanteVentaDt?.map(dt => {
                const { idComprobanteVentaDt, ...detalleData } = dt;
                return {
                    ...detalleData,
                    idComprobanteVenta: comprobanteId
                };
            });

            await ComprobanteVentaDt.bulkCreate(detallesToCreate as any[], { transaction: t });

            return await this.getIngresoById(comprobanteId, t);
        };

        if (parentTransaction) {
            return await executeLogic(parentTransaction);
        } else {
            return await sequelize.transaction(async (t) => {
                return await executeLogic(t);
            });
        }
    }

    public async getComprobantesContribucionByDateAsync(filters: FilterDto): Promise<any[]> {
        const { fechaInicio, fechaFin } = filters;
        const fechaIniFormateada = typeof fechaInicio === 'string'
            ? fechaInicio.split('T')[0]
            : fechaInicio.toISOString().split('T')[0];
        const fechaFinFormateada = typeof fechaFin === 'string'
            ? fechaFin.split('T')[0]
            : fechaFin.toISOString().split('T')[0];

        const result = await sequelize.query(
            'CALL sp_ObtenerComprobantesContribucion(:fechaIniFormateada, :fechaFinFormateada)',
            {
                replacements: { fechaIniFormateada, fechaFinFormateada }
            }
        );

        return result;
    }    
}