import { Request, Response } from 'express';
import { GrupoProducto } from '../models/grupoProductoModel';
import { handleHttp } from '../utils/handleError';
import { IGrupoProducto } from '../interfaces/IGrupoProducto';
import { registrarBitacora } from '../utils/bitacoraService';
import { SubgrupoProducto } from '../models/subgrupoProductoModel';
import { Producto } from '../models/productoModel';

const entidad = 'GRUPO_PRODUCTO';

const createGrupoProducto = async (
    req: Request<{}, {}, Omit<IGrupoProducto, 'idGrupoProducto' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const grupoProducto: Omit<IGrupoProducto, 'idGrupoProducto' | 'estado'> = req.body;
        const checkIs = await GrupoProducto.findOne({ where: { nombre: grupoProducto.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre del grupo de producto ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó el grupo de producto ${grupoProducto.nombre}.`)
            const newGrupoProducto = await GrupoProducto.create(grupoProducto);
            res.status(201).json({
                status: true,
                message: 'Grupo de producto agregado exitosamente.',
                data: newGrupoProducto
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getGruposProducto = async (req: Request, res: Response) => {
    try {
        const gruposProducto = await GrupoProducto.findAll({ where: { estado: true } });
        res.status(200).json({ value: gruposProducto });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getGrupoProductoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const grupoProducto = await GrupoProducto.findByPk(id);
        if (!grupoProducto) res.status(404).json({
            status: false,
            message: 'Grupo de producto no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: grupoProducto
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateGrupoProducto = async (req: Request & { user?: any }, res: Response) => {
    try {
        const grupoProducto: IGrupoProducto = req.body;
        const checkIs = await GrupoProducto.findByPk(grupoProducto.idGrupoProducto);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Grupo de producto no encontrado'
            });
            return
        }
        if (grupoProducto.nombre != checkIs.nombre) {
            const nameExist = await GrupoProducto.findOne({ where: { nombre: grupoProducto.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del grupo de producto ya existe'
                });
                return;
            }
        }
        checkIs.nombre = grupoProducto.nombre;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del grupo de producto ${grupoProducto.nombre}.`)
        res.status(200).json({
            status: true,
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteGrupoProducto = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const grupoProducto = await GrupoProducto.findByPk(id);
        if (!grupoProducto) {
            res.status(404).json({
                status: false,
                message: 'Grupo de producto no encontrado. Imposible eliminar.'
            });
            return;
        }
        const subgrupoProducto = await SubgrupoProducto.findOne({
            where: {
                idGrupoProducto: grupoProducto.idGrupoProducto
            }
        });
        if (subgrupoProducto) {
            res.status(404).json({
                status: false,
                message: 'Existen subgrupos de producto asignados a este grupo. Imposible eliminar.'
            });
            return;
        }
        const producto = await Producto.findOne({ where: { idGrupoProducto: grupoProducto.idGrupoProducto } });
        if (producto) {
            res.status(404).json({
                status: false,
                message: 'Existen productos asignados a este grupo. Imposible eliminar.'
            });
            return;
        }
        grupoProducto.estado = false; // Marcar como anulado
        await grupoProducto.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el grupo de producto ${grupoProducto.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Grupo de producto eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createGrupoProducto,
    getGruposProducto,
    getGrupoProductoById,
    updateGrupoProducto,
    deleteGrupoProducto
}