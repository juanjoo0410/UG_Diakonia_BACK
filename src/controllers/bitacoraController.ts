import { Request, Response } from 'express';
import { Usuario } from '../models/usuarioModel';
import { handleHttp } from '../utils/handleError';
import { Rol } from '../models/rolModel';
import { Bitacora } from '../models/bitacoraModel';
import { col, fn, Op } from 'sequelize';

const getBitacora = async (req: Request, res: Response) => {
    const { fechaInicio, fechaFin } = req.body;
    try {
        const bitacora = await Bitacora.findAll({
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin],
                },
            }, include: [{
                model: Usuario,
                as: 'usuario',
                attributes: ['nombre'],
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['idRol', 'nombre']
                }]
            }],
            order: [['fecha', 'DESC']]
        });
        res.status(200).json({
            status: true,
            value: bitacora
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getAcciones = async (req: Request, res: Response) => {
    try {
        const acciones = await Bitacora.findAll({
            attributes: [
              'accion',
              [fn('COUNT', col('accion')), 'total'] // Cuenta cuántas veces aparece cada acción
            ],
            group: ['accion'], // Agrupa por el campo 'accion'
            order: [['accion', 'ASC']],
          });
        res.status(200).json({
            status: true,
            value: acciones
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getEntidades = async (req: Request, res: Response) => {
    try {
        const entidades = await Bitacora.findAll({
            attributes: [
              'entidad',
              [fn('COUNT', col('entidad')), 'total'] // Cuenta cuántas veces aparece cada acción
            ],
            group: ['entidad'], // Agrupa por el campo 'accion'
            order: [['entidad', 'ASC']],
          });
        res.status(200).json({
            status: true,
            value: entidades
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export { getBitacora, getAcciones, getEntidades }