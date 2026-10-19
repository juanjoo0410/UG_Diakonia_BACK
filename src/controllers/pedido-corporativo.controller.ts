import { Request, Response } from 'express';
import { registrarBitacora } from "../utils/bitacoraService";
import { handleHttp } from '../utils/handleError';
import { PedidoCorporativoService } from '../services/pedido-corporativo.service';
import { IPedidoCorporativo } from '../interfaces/pedido-corporativo.interface';
import { FilterDto } from '../dtos/filter.dto';

const service = new PedidoCorporativoService();
const entidad = 'PEDIDO_CORPORATIVO';

export const create = async (
    req: Request<{}, {}, IPedidoCorporativo> & { user?: any },
    res: Response
) => {
    const data: IPedidoCorporativo = req.body;
    try {
        const usuarioId = req.user.idUsuario;
        data.creadorId = usuarioId;

        const response = await service.createPedidoCorporativo(data);
        res.status(201).json({
            status: true,
            message: response.message,
            value: response.obj,
            documentId: response.documentId
        });

        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el pedido No. ${response.obj.id}.`);

        if (response.documentId != 0)
            await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el comprobante de contribución No. ${response.documentId}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'COMPROBANTE_NO_EMITIDO') {
                res.status(400).json({
                    status: false,
                    message: 'No se pudo emitir el comprobante.'
                });
                return;
            }

            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const update = async (
    req: Request<{}, {}, IPedidoCorporativo> & { user?: any },
    res: Response
) => {
    const data: IPedidoCorporativo = req.body;
    try {
        const response = await service.updatePedidoCorporativo(data);
        res.status(200).json({
            status: true,
            message: response.message,
            value: response.obj,
            documentId: response.documentId
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información del pedido No. ${response.obj.id}.`);

        if (response.documentId != 0)
            await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el comprobante de contribución No. ${response.documentId}.`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'DOCUMENTO_NO_ENCONTRADO') {
            res.status(404).json({
                status: false,
                message: 'Pedido no encontrado.'
            });
            return;
        }

        if (errorMessage === 'DOCUMENTO_ANULADO') {
            res.status(404).json({
                status: false,
                message: 'El pedido ya fue anulado.'
            });
            return;
        }        

        if (errorMessage === 'COMPROBANTE_NO_EMITIDO') {
            res.status(400).json({
                status: false,
                message: 'No se pudo emitir el comprobante.'
            });
            return;
        }

        return handleHttp(res, `ERROR_PUT_${entidad}`, error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const pedidos = await service.getAll();
        res.status(200).json({ value: pedidos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_PEDIDOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const idNum = parseInt(id as string);
    try {
        if (isNaN(idNum)) {
            res.status(400).json({
                status: false,
                message: "PedidoId inválido."
            });
            return;
        }

        const pedido = await service.getPedidoCorporativoById(idNum);
        if (!pedido) {
            res.status(404).json({
                status: false,
                message: 'Pedido no encontrado'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: pedido
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};

export const annular = async (
    req: Request<{ id: string }, {}, {}, {}> & { user?: any },
    res: Response) => {
    const { id } = req.params;
    const idNum = parseInt(id as string);
    try {
        const usuarioId = req.user.idUsuario;

        if (isNaN(idNum)) {
            res.status(400).json({
                status: false,
                message: "PedidoId inválido."
            });
            return;
        }

        const pedido = await service.annularPedidoCorporativoById(idNum, usuarioId);
        if (!pedido) {
            res.status(404).json({
                status: false,
                message: 'Pedido no encontrado'
            });
            return;
        }
        res.status(200).json({
            status: true,
            message: 'Pedido anulado exitosamente'
        });

        await registrarBitacora(req, 'ANULACIÓN', entidad, `Se anuló el pedido No. ${idNum}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'PEDIDO_NO_ENCONTRADO') {
                res.status(400).json({
                    status: false,
                    message: 'Pedido no encontrado.'
                });
                return;
            }

            if (error.message === 'PEDIDO_ANULADO') {
                res.status(400).json({
                    status: false,
                    message: 'El pedido ya fue anulado.'
                });
                return;
            }

            return handleHttp(res, `ERROR_ANNULAR_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_ANNULAR_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const getPedidosByDateAndEmpresaId = async (
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
        const response = await service.getPedidosByDateAndEmpresaIdAsync(filters);

        res.status(200).json({
            status: true,
            value: response
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_${entidad}`, error);
    }
};