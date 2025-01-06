import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { Op } from 'sequelize';
import { IProducto } from '../interfaces/IProducto';
import { Producto } from '../models/productoModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';

const entidad = 'PRODUCTO';

const createProducto = async (
    req: Request<{}, {}, Omit<IProducto, 'idProducto' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const producto: Omit<IProducto, 'idProducto' | 'estado'> = req.body;
        const checkIs = await Producto.findOne({
            where: {
                [Op.or]: [
                    { sku: producto.sku },
                    { descripcion: { [Op.like]: `%${producto.descripcion}%` } },
                ],
            }
        });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El sku o descripcion del producto ya existen en la base datos.'
            });
            return;
        }
        producto.codigo = await generarCodigo('productos', transaction);
        const newProducto = await Producto.create(producto);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Producto agregado exitosamente.',
            data: newProducto
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el producto ${producto.descripcion}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getProductos = async (req: Request, res: Response) => {
    try {
        const productos = await Producto.findAll({ where: { estado: true } });
        res.status(200).json({ value: productos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getProductoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) res.status(404).json({
            status: false,
            message: 'Producto no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: producto
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateProducto = async (req: Request & { user?: any }, res: Response) => {
    try {
        const producto: IProducto = req.body;
        const checkIs = await Producto.findByPk(producto.idProducto);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Producto no encontrado'
            });
            return;
        }
        if (producto.descripcion != checkIs.descripcion) {
            const nameExist = await Producto.findOne({ where: { descripcion: producto.descripcion } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'La descripcion del producto ya existe'
                });
                return;
            }
        }
        checkIs.descripcion = producto.descripcion;
        checkIs.idGrupoProducto = producto.idGrupoProducto;
        checkIs.idSubgrupoProducto = producto.idSubgrupoProducto;
        checkIs.idCategoria = producto.idCategoria;
        checkIs.idDonante = producto.idDonante;
        checkIs.prest = producto.prest;
        checkIs.unidadesPorPrest = producto.unidadesPorPrest;
        checkIs.pesoPorUnidad = producto.pesoPorUnidad;
        checkIs.unidadPeso = producto.unidadPeso;
        checkIs.lote = producto.lote;
        checkIs.fechaCaducidad = producto.fechaCaducidad;
        checkIs.precioCosto = producto.precioCosto;
        checkIs.precioTiendita = producto.precioTiendita;
        checkIs.sku = producto.sku;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del producto ${producto.descripcion}.`)
        res.status(200).json({
            status: true,
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteProducto = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            res.status(404).json({
                status: false,
                message: 'Producto no encontrado. Imposible eliminar.'
            });
            return;
        }
        producto.estado = false; // Marcar como anulado
        await producto.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el producto ${producto.descripcion}.`);
        res.status(200).json({
            status: true,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createProducto,
    getProductos,
    getProductoById,
    updateProducto,
    deleteProducto
}