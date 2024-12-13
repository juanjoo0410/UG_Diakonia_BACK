import { Request, Response } from 'express';
import { Usuario } from '../models/usuarioModel';
import { handleHttp } from '../utils/handleError';
import { Rol } from '../models/rolModel';
import { Bitacora } from '../models/bitacoraModel';

const getBitacora = async (req: Request, res: Response) => {
    try {
        const bitacora = await Bitacora.findAll({
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre'],
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['idRol','nombre']
                }]
            }]
        });
        res.status(200).json({
            status: true,
            value: bitacora
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export{ getBitacora }