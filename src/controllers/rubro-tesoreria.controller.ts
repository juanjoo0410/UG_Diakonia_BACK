import { Request, Response } from 'express';
import { IRubroTesoreria } from "../interfaces/rubro-tesoreria.interface";
import { RubroTesoreriaService } from "../services/rubro-tesoreria.service";
import { RubroTesoreria } from '../models/rubro-tesoreria.model';
import { registrarBitacora } from '../utils/bitacoraService';
import { handleHttp } from '../utils/handleError';

const service = new RubroTesoreriaService();
const entidad = 'RUBRO_TESORERIA';

export const create = async (
    req: Request<{}, {}, IRubroTesoreria> & { user?: any },
    res: Response
) => {
    const RubroTesoreriaData: IRubroTesoreria = req.body;
    try {
        const newRubroTesoreria: RubroTesoreria = await service.createRubroTesoreria(RubroTesoreriaData);
        res.status(201).json({
            status: true,
            message: 'Rubro agregado exitosamente.',
            value: newRubroTesoreria
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el rubro ${RubroTesoreriaData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Rubro ya existe.'
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
    req: Request<{}, {}, IRubroTesoreria> & { user?: any },
    res: Response
) => {
    const RubroTesoreriaData: IRubroTesoreria = req.body;
    try {
        const updatedRubroTesoreria = await service.updateRubroTesoreria(RubroTesoreriaData);
        res.status(200).json({
            status: true,
            message: 'Datos actualizados exitosamente',
            value: updatedRubroTesoreria
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información del rubro ${updatedRubroTesoreria.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Rubro no encontrado.'
            });
            return;
        }
        
        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre de Rubro ya existe.'
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
        const updatedRubroTesoreria = await service.updateRubroTesoreriaStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del rubro ${updatedRubroTesoreria.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del rubro actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Rubro no encontrado. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await service.getAll();
        res.status(200).json({ value: response });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_RUBROS_TESORERIA', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const RubroTesoreria = await service.getById(id);
        if (!RubroTesoreria) {
            res.status(404).json({
                status: false,
                message: 'Rubro no encontrada/o'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: RubroTesoreria
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};