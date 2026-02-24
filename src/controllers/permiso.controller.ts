import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { PermisoService } from '../services/permiso.service';
import { IPermiso } from '../interfaces/permiso.interface';
import { Permiso } from '../models/Permiso.model';

const permisoService = new PermisoService();
const entidad = 'PERMISO';

export const updateStatus = async (
    req: Request<{ id: string }> & { user?: any },
    res: Response
) => {
    const id = req.params.id;
    try {
        const updatedPermiso = await permisoService.updatePermisoStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del permiso ${updatedPermiso.codigo}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del Permiso actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Permiso no encontrado. Imposible cambiar de estado.'
            });
            return;
        }

        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const permisos = await permisoService.getAll();
        res.status(200).json({ value: permisos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_PERMISOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const permiso = await permisoService.getById(id);
        if (!permiso) {
            res.status(404).json({
                status: false,
                message: 'Permiso no encontrado'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: permiso
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};