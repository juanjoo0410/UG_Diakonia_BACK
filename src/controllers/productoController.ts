import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { col, fn, Op, Sequelize } from 'sequelize';
import { IProducto } from '../interfaces/IProducto';
import { Producto } from '../models/productoModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';
import { GrupoProducto } from '../models/grupoProductoModel';
import { SubgrupoProducto } from '../models/subgrupoProductoModel';
import { Categoria } from '../models/categoriaModel';
import { Stock } from '../models/stockModel';
import { Ingreso } from '../models/ingresoModel';
import { Egreso } from '../models/egresoModel';
import { ComprobanteVenta } from '../models/comprobanteVentaModel';
import { Bodega } from '../models/bodegaModel';
import { Ubicacion } from '../models/ubicacionModel';

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
                    { descripcion: producto.descripcion }
                ],
            }
        });
        console.log("POR AQUI VOY");
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message:
                    `La descripcion del producto ya existe en la base datos. Codigo: ${checkIs.codigo}`
            });
            return;
        }
        console.log("NO EXISTE");
        producto.codigo = await generarCodigo('productos', transaction);
        console.log("SE GENERO CODIGO");
        const newProducto = await Producto.create(producto);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Producto agregado exitosamente.',
            value: newProducto
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
        const productos = await Producto.findAll({
            include: [
                {
                    model: GrupoProducto,
                    as: 'grupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: SubgrupoProducto,
                    as: 'subgrupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json({ value: productos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotalProductos = async (req: Request, res: Response) => {
    try {
        const totalProductos = await Producto.count({
            where: {
                estado: true,
            },
        });
        res.status(200).json({ status: true, value: totalProductos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getProductosConStock = async (req: Request, res: Response) => {
    try {
        const productos = await Producto.findAll({
            where: { estado: true },
            include: [
                {
                    model: Stock,
                    as: 'stocks',
                    attributes: [] // No incluir los campos de Stock directamente en el resultado
                },
                {
                    model: GrupoProducto,
                    as: 'grupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: SubgrupoProducto,
                    as: 'subgrupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nombre']
                }
            ],
            group: [
                'idProducto',
                'idGrupoProducto',
                'idSubgrupoProducto',
                'idCategoria'
            ],
            having: Sequelize.literal('SUM(stocks.stock) > 0')
        });
        res.status(200).json({ value: productos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getProductosConStockByUbicacion = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const productos = await Producto.findAll({
            where: {
                estado: true, precioTiendita: {
                    [Op.gt]: 0 // Filtra solo aquellos con precioTiendita mayor a 0
                }
            },
            include: [
                {
                    model: Stock,
                    as: 'stocks',
                    attributes: [],
                    where: { idUbicacion: id }, // No incluir los campos de Stock directamente en el resultado
                }
            ],
            group: [
                'idProducto'
            ],
            having: Sequelize.literal('SUM(stocks.stock) > 0')
        });
        res.status(200).json({ value: productos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getProductosUndSinPrecio = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        //const { idP, idU } = req.body;
        const productos = await Stock.findAll({
            where: {
                idBodega: id,
                stock: { [Op.gt]: 0 },
            },
            attributes: ['idProducto',
                [fn('SUM', Sequelize.col('stock')), 'totalStock']],
            group: [
                'idProducto'],
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['descripcion', 'precioTiendita', 'prest', 'fechaCaducidad', 'sku'], //quitar sku y fecha
                    where: [{ prest: 'UND' }],
                    include: [
                        {
                            model: GrupoProducto,
                            as: 'grupoProducto',
                            attributes: ['nombre'],
                        },
                        {
                            model: SubgrupoProducto,
                            as: 'subgrupoProducto',
                            attributes: ['nombre'],
                        },
                    ],
                },
            ],
        });
        res.status(200).json({ status: true, value: productos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getProductosPlanificacion = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const whereConditions: any = { stock: { [Op.gt]: 0 } };
        if (id != '0') whereConditions.idBodega = id;

        const productos = await Stock.findAll({
            where: whereConditions,
            attributes: ['idProducto', 'stock'],
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['descripcion', 'fechaCaducidad', 'sku']
                },
                {
                    model: Bodega,
                    as: 'bodega',
                    attributes: ['codigo'],
                    where: { venta: false }
                },
                {
                    model: Ubicacion,
                    as: 'ubicacion',
                    attributes: ['codigo']
                },
            ],
            order: [
                [Sequelize.literal(`CASE WHEN producto.fechaCaducidad IS NULL THEN 1 ELSE 0 END`), 'ASC'],
                [Sequelize.col('producto.fechaCaducidad'), 'ASC']
            ],
        });
        res.status(200).json({ status: true, value: productos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getSalidaEntradaAnual = async (req: Request, res: Response) => {
    try {
        const year = new Date().getFullYear();
        const inicioAño = `${year}-01-01`;
        const finAño = `${year}-12-31`;

        const ingresos = await Ingreso.findAll({
            attributes: [
                [fn('MONTH', col('fecha')), 'mes'],
                [fn('SUM', col('totalPeso')), 'totalPesoIng'],
            ],
            where: {
                estado: true,
                fecha: {
                    [Op.between]: [inicioAño, finAño],
                },
            },
            group: [fn('MONTH', col('fecha'))],
            raw: true, // Para que devuelva un objeto plano
        });

        const egresos = await Egreso.findAll({
            attributes: [
                [fn('MONTH', col('fecha')), 'mes'],
                [fn('SUM', col('totalPeso')), 'totalPesoEg'],
            ],
            where: {
                estado: true,
                fecha: {
                    [Op.between]: [inicioAño, finAño],
                },
            },
            group: [fn('MONTH', col('fecha'))],
            raw: true,
        });

        const ventas = await ComprobanteVenta.findAll({
            attributes: [
                [fn('MONTH', col('fecha')), 'mes'],
                [fn('SUM', col('totalPeso')), 'totalPesoVent'],
            ],
            where: {
                estado: true,
                fecha: {
                    [Op.between]: [inicioAño, finAño],
                },
            },
            group: [fn('MONTH', col('fecha'))],
            raw: true,
        });

        res.status(200).json({ status: true, value: { ingresos, egresos, ventas } });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getProductosTopVencidos = async (req: Request, res: Response) => {
    try {
        const productos = await Producto.findAll({
            attributes: [
                'codigo',
                'descripcion',
                'fechaCaducidad'
            ],
            where: {
                estado: true,
                fechaCaducidad: { [Op.not]: null as unknown as Date }
            },
            include: {
                model: Stock,
                as: 'stocks',
                attributes: ['stock'],
                where: { stock: { [Op.gt]: 0 } },
                include:
                    [{
                        model: Bodega,
                        as: 'bodega',
                        attributes: ['nombre',]
                    },
                    {
                        model: Ubicacion,
                        as: 'ubicacion',
                        attributes: ['codigo']
                    }]
            },
            order: [['fechaCaducidad', 'ASC'], ['idProducto', 'ASC']],
            limit: 5
        });

        res.status(200).json({ status: true, value: productos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_VENCIDOS', error);
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
        if (producto.descripcion.toLocaleUpperCase() !=
            checkIs.descripcion.toLocaleUpperCase()) {
            const nameExist = await Producto.findOne({ where: { descripcion: producto.descripcion } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'La descripcion del producto ya existe'
                });
                return;
            }
        };
        checkIs.descripcion = producto.descripcion;
        checkIs.idGrupoProducto = producto.idGrupoProducto;
        checkIs.idSubgrupoProducto = producto.idSubgrupoProducto;
        checkIs.idCategoria = producto.idCategoria;
        checkIs.prest = producto.prest;
        checkIs.unidadesPorPrest = producto.unidadesPorPrest;
        checkIs.pesoPorUnidad = producto.pesoPorUnidad;
        checkIs.unidadPeso = producto.unidadPeso;
        checkIs.lote = producto.lote;
        checkIs.fechaCaducidad = producto.fechaCaducidad;
        checkIs.precioCosto = producto.precioCosto;
        checkIs.precioTiendita = producto.precioTiendita;
        checkIs.noAplicaDescuento = producto.noAplicaDescuento;
        checkIs.sku = producto.sku;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del producto ${producto.descripcion}.`)
        res.status(200).json({
            status: true,
            message: 'Datos de producto actualizados exitosamente',
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const updatePrecios = async (
    req: Request & { user?: any }, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const productos = req.body;

        if (!Array.isArray(productos) || productos.length === 0) {
            res.status(400).json({ status: false, message: 'Debe enviar una lista de productos válida.' });
            return;
        }

        const actualizaciones = productos.map((producto) => {
            return Producto.update(
                { precioTiendita: producto.precioTiendita },
                { where: { idProducto: producto.idProducto } })
        });
        await Promise.all(actualizaciones);
        await transaction.commit();
        await registrarBitacora(req, 'ACTUALIZACION_PRECIOS', entidad,
            `Se actualizaron los precios de los productos de Tiendita.`);
        res.json({
            status: true,
            message: 'Precios actualizados correctamente.'
        });
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_PUT', error);
    }
};

const updateStatusProducto = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            res.status(404).json({
                status: false,
                message: 'Producto no encontrado. Imposible cambiar de estado.'
            });
            return;
        }
        let status = true;
        if (producto.estado) {
            status = false;
            const stock = await Stock.findOne({
                where: {
                    idProducto: id,
                    stock: { [Op.gt]: 0 },
                }
            });
            if (stock) {
                res.status(404).json({
                    status: false,
                    message: 'El producto dispone de stock. Imposible desactivar.'
                });
                return;
            }
        }
        producto.estado = status; // Marcar como anulado
        await producto.save();
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del producto ${producto.descripcion}.`);
        res.status(200).json({
            status: true,
            message: 'Estado de Producto actualizado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createProducto,
    getProductos,
    getTotalProductos,
    getProductosConStock,
    getProductosConStockByUbicacion,
    getProductosUndSinPrecio,
    getProductosPlanificacion,
    getSalidaEntradaAnual,
    getProductosTopVencidos,
    getProductoById,
    updateProducto,
    updatePrecios,
    updateStatusProducto as deleteProducto
}