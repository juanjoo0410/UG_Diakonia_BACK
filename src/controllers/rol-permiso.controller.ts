import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { RolPermisoService } from '../services/rol-permiso.service';

const rolPermisoService = new RolPermisoService();
const entidad = 'ROL_PERMISO';

export const getPermisosByRol = async (req: Request, res: Response) => {
    try {
        const { idRol } = req.params;
        if (!idRol) {
            res.status(404).json({
                status: false,
                message: 'Es necesario el ID del rol para obtener los permisos.'
            });
            return;
        }

        const permisos = await rolPermisoService.getAllPermisosByIdRol(idRol);
        res.status(200).json({
            status: true,
            value: permisos
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_PERMISOS_BY_ROL', error);
    }
};