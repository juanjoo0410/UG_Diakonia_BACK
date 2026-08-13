import sequelize from "../config/db";
import { BaseCRUDService } from "./base-crud.service";
import { IIngresoTesoreria } from "../interfaces/ingreso-tesoreria.interface";
import { IngresoTesoreria } from "../models/ingreso-tesoreria.model";
import { IngresoTesoreriaDt } from "../models/ingreso-tesoreria-dt.model";
import { IngresoTesoreriaDocumento } from "../models/ingreso-tesoreria-documento.model";
import { IngresoTesoreriaDenominacion } from "../models/ingreso-tesoreria-denominacion.model";
import { Transaction } from "sequelize";

type ICreationData = Omit<IIngresoTesoreria, 'id' | 'anulado'>;

export class IngresoTesoreriaService extends BaseCRUDService<IngresoTesoreria> {
    constructor() {
        super(IngresoTesoreria);
    }

    public async getIngresoById(id: number, transaction?: any): Promise<IngresoTesoreria> {
        const ingreso = await this.ModelClass.findByPk(id, {
            include: [{
                model: IngresoTesoreriaDt,
                as: 'detalles'
            }, {
                model: IngresoTesoreriaDocumento,
                as: 'documentos'
            }, {
                model: IngresoTesoreriaDenominacion,
                as: 'denominaciones'
            }],
            transaction
        });

        if (!ingreso) throw new Error('INGRESO_NO_ENCONTRADO');
        return ingreso;
    }

    public async createIngreso(data: ICreationData, parentTransaction?: Transaction): Promise<IngresoTesoreria> {
        const executeLogic = async (t: Transaction): Promise<IngresoTesoreria> => {
            const nuevoIngreso = await this.ModelClass.create(data, { transaction: t });

            const ingresoId = nuevoIngreso.id ?? 0;
            if (data.tipo == 'TRANSF-CAJA') {
                const detallesToCreate = data.detalles?.map(dt => {
                    const { id, ...detalleData } = dt;
                    return {
                        ...detalleData,
                        ingresoTesoreriaId: ingresoId
                    };
                });

                await IngresoTesoreriaDt.bulkCreate(detallesToCreate as any[], { transaction: t });
            }

            if (data.tipo == 'TRANSF-CAJA') {
                const documentosToCreate = data.documentos?.map(dctos => {
                    const { id, ...documentoData } = dctos;
                    return {
                        ...documentoData,
                        ingresoTesoreriaId: ingresoId
                    };
                });

                await IngresoTesoreriaDocumento.bulkCreate(documentosToCreate as any[], { transaction: t });
            }

            if (data.tipo == 'TRANSF-CAJA') {
                const denominacionesToCreate = data.denominaciones?.map(dmns => {
                    const { id, ...denominacionData } = dmns;
                    return {
                        ...denominacionData,
                        ingresoTesoreriaId: ingresoId
                    };
                });

                await IngresoTesoreriaDenominacion.bulkCreate(denominacionesToCreate as any[], { transaction: t });
            }

            return await this.getIngresoById(nuevoIngreso.id ?? 0, t);
        };

        if (parentTransaction) {
            return await executeLogic(parentTransaction);
        } else {
            return await sequelize.transaction(async (t) => {
                return await executeLogic(t);
            });
        }
    }
}