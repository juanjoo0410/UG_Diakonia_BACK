import { Request, Response } from 'express';
import { registrarBitacora } from "../utils/bitacoraService";
import { handleHttp } from '../utils/handleError';
import { TransferenciaBancariaService } from '../services/transferencia-bancaria.service';
import { ITransferenciaBancaria } from '../interfaces/transferencia-bancaria.interface';
import { TransferenciaBancaria } from '../models/transferencia-bancaria.moldel';

const service = new TransferenciaBancariaService();
const entidad = 'TRANSFERENCIA_BANCARIA';

export const create = async (
    req: Request<{}, {}, ITransferenciaBancaria> & { user?: any },
    res: Response
) => {
    const data: ITransferenciaBancaria = req.body;
    try {
        const usuarioId = req.user.idUsuario;
        data.creadorId = usuarioId;

        const newTransferenciaBancaria: TransferenciaBancaria = await service.createTransferencia(data);
        res.status(201).json({
            status: true,
            message: 'Transferencia bancaria creada exitosamente.',
            value: newTransferenciaBancaria
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó la Transferencia bancaria ${data.id}.`);
    } catch (error) {
        if (error instanceof Error) {
            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const transferencias = await service.getAll();
        res.status(200).json({
            status: true,
            value: transferencias
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_TRANSFERENCIAS_BANCARIAS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const transferencia = await service.getById(id);
        if (!transferencia) {
            res.status(404).json({
                status: false,
                message: 'Transferencia bancaria no encontrada/o'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: transferencia
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};