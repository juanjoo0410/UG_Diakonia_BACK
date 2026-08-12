import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { KardexTesoreriaService } from '../services/kardex-tesoreria.service';
import { FilterDto } from '../dtos/filter.dto';

const service = new KardexTesoreriaService();
const entidad = 'KARDEX_TESORERIA';

export const getAll = async (req: Request, res: Response) => {
    try {
        const kardex = await service.getAll();
        res.status(200).json({ value: kardex });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_KARDEX_TESORERIA', error);
    }
};

export const getKardexCajaBancoByFecha = async (
    req: Request<{}, {}, FilterDto>,
    res: Response
) => {
    const filters: FilterDto = req.body;

    if (!filters.fechaInicio || !filters.fechaFin) {
        res.status(400).json({
            status: false,
            message: 'Se requieren fechaInicio y fechaFin para la consulta.'
        });
        return;
    }

    try {
        const kardex = await service.getKardexCajaBancoByFecha(filters);

        res.status(200).json({
            status: true,
            value: kardex
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_${entidad}`, error);
    }
};