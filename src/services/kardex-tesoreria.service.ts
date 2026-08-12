import { Transaction } from "sequelize";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { IKardexTesoreria } from "../interfaces/kardex-tesoreria.interface";
import { KardexTesoreria } from "../models/kardex-tesoreria.model";
import { FilterDto } from "../dtos/filter.dto";

type KardexTesoreriaCreationData = Omit<IKardexTesoreria, 'id'>;

export class KardexTesoreriaService extends BaseCRUDService<KardexTesoreria> {
    constructor() {
        super(KardexTesoreria);
    }

    public async createKardex(data: KardexTesoreriaCreationData): Promise<KardexTesoreria> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const newKardex = await this.ModelClass.create(data, { transaction });
            await transaction.commit();
            return newKardex;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async getKardexCajaBancoByFecha(filters: FilterDto): Promise<any[]> {
        const { fechaInicio, fechaFin, cajaBancoId } = filters;
        const fechaIniFormateada = typeof fechaInicio === 'string'
            ? fechaInicio.split('T')[0]
            : fechaInicio.toISOString().split('T')[0];
        const fechaFinFormateada = typeof fechaFin === 'string'
            ? fechaFin.split('T')[0]
            : fechaFin.toISOString().split('T')[0];

        const resultados = await sequelize.query(
            'CALL sp_ObtenerKardexCajaBanco(:cajaBancoId, :fechaIniFormateada, :fechaFinFormateada)',
            {
                replacements: {
                    cajaBancoId: cajaBancoId ? Number(cajaBancoId) : null,
                    fechaIniFormateada,
                    fechaFinFormateada
                }
            }
        );

        return resultados;
    }
}