import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { InstalacionExternaService } from '../services/instalacion-externa.service';
import { IInstalacionExterna } from '../interfaces/instalacion-externa.interface';
import { InstalacionExterna } from '../models/InstalacionExterna.model';

const instalacionExternaService = new InstalacionExternaService();
const entidad = 'INSTALACION_EXTERNA';

export const create = async (
    req: Request<{}, {}, IInstalacionExterna> & { user?: any },
    res: Response
) => {
    const instalacionExternaData: IInstalacionExterna = req.body;
    try {
        const newInstalacionExterna: InstalacionExterna = await instalacionExternaService.createInstalacionExterna(instalacionExternaData);
        res.status(201).json({
            status: true,
            message: 'Instalación Externa agregada exitosamente.',
            value: newInstalacionExterna
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó la instalación externa ${instalacionExternaData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Instalación Externa ya existe.'
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
    req: Request<{}, {}, IInstalacionExterna> & { user?: any },
    res: Response
) => {
    const instalacionExternaData: IInstalacionExterna = req.body;
    try {
        const updatedInstalacionExterna = await instalacionExternaService.updateInstalacionExterna(instalacionExternaData);
        res.status(200).json({
            status: true,
            message: 'Datos de instalación externa actualizados exitosamente',
            value: updatedInstalacionExterna
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la instalación externa ${updatedInstalacionExterna.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Instalación Externa no encontrada.'
            });
            return;
        }
        
        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre de la Instalación Externa ya existe.'
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
        const updatedInstalacionExterna = await instalacionExternaService.updateInstalacionExternaStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado de la instalación externa ${updatedInstalacionExterna.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado de la Instalación Externa actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Instalación Externa no encontrada. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const instalacionesExternas = await instalacionExternaService.getAll();
        res.status(200).json({ value: instalacionesExternas });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_INSTALACIONES_EXTERNAS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const instalacionExterna = await instalacionExternaService.getById(id);
        if (!instalacionExterna) {
            res.status(404).json({
                status: false,
                message: 'Instalación Externa no encontrada'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: instalacionExterna
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};