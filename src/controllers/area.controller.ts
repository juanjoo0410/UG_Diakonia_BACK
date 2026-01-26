import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { AreaService } from '../services/area.service';
import { Area } from '../models/Area.model';
import { IArea } from '../interfaces/area.interface';

const areaService = new AreaService();
const entidad = 'AREA';

export const create = async (
    req: Request<{}, {}, IArea> & { user?: any },
    res: Response
) => {
    const areaData: IArea = req.body;
    try {
        const newArea: Area = await areaService.createArea(areaData);
        res.status(201).json({
            status: true,
            message: 'Área agregada exitosamente.',
            value: newArea
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el área ${areaData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Área ya existe.'
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
    req: Request<{}, {}, IArea> & { user?: any },
    res: Response
) => {
    const areaData: IArea = req.body;
    try {
        const updatedArea = await areaService.updateArea(areaData);
        res.status(200).json({
            status: true,
            message: 'Datos de área actualizados exitosamente',
            value: updatedArea
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información del área ${updatedArea.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Área no encontrada.'
            });
            return;
        }
        
        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre del Área ya existe.'
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
        const updatedArea = await areaService.updateAreaStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del área ${updatedArea.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del Área actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Área no encontrada. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const areas = await areaService.getAll();
        res.status(200).json({ value: areas });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_AREAS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const area = await areaService.getById(id);
        if (!area) {
            res.status(404).json({
                status: false,
                message: 'Área no encontrada'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: area
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};