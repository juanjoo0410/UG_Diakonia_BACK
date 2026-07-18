import { Request, Response } from 'express';
import { DivisaService } from "../services/divisa.service";
import { IDivisa } from '../interfaces/divisa.interface';
import { Divisa } from '../models/divisa.model';
import { registrarBitacora } from '../utils/bitacoraService';
import { handleHttp } from '../utils/handleError';
import { DivisaDenominacion } from '../models/divisa-denominacion.model';

const service = new DivisaService();
const entidad = 'DIVISA';

export const create = async (
    req: Request<{}, {}, IDivisa> & { user?: any },
    res: Response
) => {
    const DivisaData: IDivisa = req.body;
    try {
        const newDivisa: Divisa = await service.createDivisa(DivisaData);
        res.status(201).json({
            status: true,
            message: 'Divisa agregada exitosamente.',
            value: newDivisa
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó la divisa ${DivisaData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Divisa ya existe.'
                });
                return;
            }

            if (error.message === 'EXISTE_DIVISA_BASE') {
                res.status(404).json({
                    status: false,
                    message: 'Ya existe una divisa base.'
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
    req: Request<{}, {}, IDivisa> & { user?: any },
    res: Response
) => {
    const DivisaData: IDivisa = req.body;
    try {
        const updatedDivisa = await service.updateDivisa(DivisaData);
        res.status(200).json({
            status: true,
            message: 'Datos actualizados exitosamente',
            value: updatedDivisa
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la divisa ${updatedDivisa.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Divisa no encontrada.'
            });
            return;
        }

        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre de divisa ya existe.'
            });
            return;
        }

        if (errorMessage === 'EXISTE_DIVISA_BASE') {
            res.status(404).json({
                status: false,
                message: 'Ya existe una divisa base.'
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
        const updatedDivisa = await service.updateDivisaStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado de la divisa ${updatedDivisa.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado de la divisa actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Divisa no encontrada. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const divisas = await service.getAll({
            include: [
                {
                    model: DivisaDenominacion,
                    as: 'denominaciones',
                    attributes: ['id', 'tipo', 'descripcion', 'valor'],
                    where: { anulado: false },
                    required: false
                }
            ]
        });
        res.status(200).json({ value: divisas });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_DIVISAS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const Divisa = await service.getById(id);
        if (!Divisa) {
            res.status(404).json({
                status: false,
                message: 'Divisa no encontrada'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: Divisa
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};