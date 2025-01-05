import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { ICategoria } from '../interfaces/ICategoria';
import { Categoria } from '../models/categoriaModel';
import { Producto } from '../models/productoModel';

const entidad = 'CATEGORIA';

const createCategoria = async (
    req: Request<{}, {}, Omit<ICategoria, 'idCategoria' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const categoria: Omit<ICategoria, 'idCategoria' | 'estado'> = req.body;
        const checkIs = await Categoria.findOne({ where: { nombre: categoria.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre de la categoria ya existe en la base datos.'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó la categoria ${categoria.nombre}.`)
            const newCategoria = await Categoria.create(categoria);
            res.status(201).json({
                status: true,
                message: 'Categoria agregada exitosamente.',
                data: newCategoria
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getCategorias = async (req: Request, res: Response) => {
    try {
        const categorias = await Categoria.findAll({ where: { estado: true } });
        res.status(200).json({ value: categorias });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getCategoriaById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) res.status(404).json({
            status: false,
            message: 'Categoría no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: categoria
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateCategoria = async (req: Request & { user?: any }, res: Response) => {
    try {
        const categoria: ICategoria = req.body;
        const checkIs = await Categoria.findByPk(categoria.idCategoria);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Categoría no encontrado'
            });
            return;
        }
        if (categoria.nombre != checkIs.nombre) {
            const nameExist = await Categoria.findOne({ where: { nombre: categoria.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nombre de la Categoría ya existe'
                });
                return;
            }
        }
        checkIs.nombre = categoria.nombre;
        checkIs.idGrupoProducto = categoria.idGrupoProducto;
        checkIs.idSubgrupoProducto = categoria.idSubgrupoProducto;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información de la categoría ${categoria.nombre}.`)
        res.status(200).json({
            status: true,
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteCategoria = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            res.status(404).json({
                status: false,
                message: 'Categoría no encontrada. Imposible eliminar.'
            });
            return;
        }
        const producto = await Producto.findOne({ where: { idCategoria: categoria.idCategoria } });
        if (producto) {
            res.status(404).json({
                status: false,
                message: 'Existen productos asignados a esta categoría. Imposible eliminar.'
            });
            return;
        }
        categoria.estado = false; // Marcar como anulado
        await categoria.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó la categoría ${categoria.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Categoría eliminada correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createCategoria,
    getCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
}