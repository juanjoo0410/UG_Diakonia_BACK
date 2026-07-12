import { Request, Response } from 'express';
import { ICajaBanco } from "../interfaces/caja-banco.interface";
import { CajaBanco } from "../models/caja-banco.model";
import { CajaBancoService } from "../services/caja-banco.service";
import { registrarBitacora } from "../utils/bitacoraService";
import { handleHttp } from '../utils/handleError';

const service = new CajaBancoService();
const entidad = 'CAJA_BANCO';

export const create = async (
    req: Request<{}, {}, ICajaBanco> & { user?: any },
    res: Response
) => {
    const cajaBancoData: ICajaBanco = req.body;
    try {
        const newCajaBanco: CajaBanco = await service.createCajaBanco(cajaBancoData);
        res.status(201).json({
            status: true,
            message: 'Caja/Banco agregada/o exitosamente.',
            value: newCajaBanco
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó la caja/banco ${cajaBancoData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Caja/Banco ya existe.'
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
    req: Request<{}, {}, ICajaBanco> & { user?: any },
    res: Response
) => {
    const cajaBancoData: ICajaBanco = req.body;
    try {
        const updatedCajaBanco = await service.updateCajaBanco(cajaBancoData);
        res.status(200).json({
            status: true,
            message: 'Datos actualizados exitosamente',
            value: updatedCajaBanco
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la caja/banco ${updatedCajaBanco.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Caja/Banco no encontrada/o.'
            });
            return;
        }
        
        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre de Caja/Banco ya existe.'
            });
            return;
        }

        return handleHttp(res, `ERROR_PUT_${entidad}`, error);
    }
};

export const updateStatus = async (
    req: Request<{ id: string }> & { user?: any },
    res: Response
) => {
    const id = req.params.id; 
    try {
        const updatedCajaBanco = await service.updateCajaBancoStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado de la caja/banco ${updatedCajaBanco.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado de la Caja/Banco actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Caja/Banco no encontrada. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const cajasBancos = await service.getAll();
        res.status(200).json({ value: cajasBancos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_CAJAS_BANCOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const cajaBanco = await service.getById(id);
        if (!cajaBanco) {
            res.status(404).json({
                status: false,
                message: 'Caja/Banco no encontrada/o'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: cajaBanco
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};