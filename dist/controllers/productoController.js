"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducto = exports.updatePrecios = exports.updateProducto = exports.getProductoById = exports.getSalidaEntradaAnual = exports.getProductosUndSinPrecio = exports.getProductosConStockByUbicacion = exports.getProductosConStock = exports.getTotalProductos = exports.getProductos = exports.createProducto = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const sequelize_1 = require("sequelize");
const productoModel_1 = require("../models/productoModel");
const db_1 = __importDefault(require("../config/db"));
const contadorService_1 = require("../utils/contadorService");
const grupoProductoModel_1 = require("../models/grupoProductoModel");
const subgrupoProductoModel_1 = require("../models/subgrupoProductoModel");
const categoriaModel_1 = require("../models/categoriaModel");
const stockModel_1 = require("../models/stockModel");
const ingresoModel_1 = require("../models/ingresoModel");
const egresoModel_1 = require("../models/egresoModel");
const entidad = 'PRODUCTO';
const createProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const producto = req.body;
        const checkIs = yield productoModel_1.Producto.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { descripcion: producto.descripcion }
                ],
            }
        });
        console.log("POR AQUI VOY");
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: `La descripcion del producto ya existe en la base datos. Codigo: ${checkIs.codigo}`
            });
            return;
        }
        console.log("NO EXISTE");
        producto.codigo = yield (0, contadorService_1.generarCodigo)('productos', transaction);
        console.log("SE GENERO CODIGO");
        const newProducto = yield productoModel_1.Producto.create(producto);
        yield transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Producto agregado exitosamente.',
            value: newProducto
        });
        yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el producto ${producto.descripcion}.`);
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createProducto = createProducto;
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield productoModel_1.Producto.findAll({
            where: { estado: true },
            include: [
                {
                    model: grupoProductoModel_1.GrupoProducto,
                    as: 'grupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: subgrupoProductoModel_1.SubgrupoProducto,
                    as: 'subgrupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: categoriaModel_1.Categoria,
                    as: 'categoria',
                    attributes: ['nombre']
                }
            ]
        });
        res.status(200).json({ value: productos });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getProductos = getProductos;
const getTotalProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalProductos = yield productoModel_1.Producto.count({
            where: {
                estado: true,
            },
        });
        res.status(200).json({ status: true, value: totalProductos });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getTotalProductos = getTotalProductos;
const getProductosConStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield productoModel_1.Producto.findAll({
            where: { estado: true },
            include: [
                {
                    model: stockModel_1.Stock,
                    as: 'stocks',
                    attributes: [] // No incluir los campos de Stock directamente en el resultado
                },
                {
                    model: grupoProductoModel_1.GrupoProducto,
                    as: 'grupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: subgrupoProductoModel_1.SubgrupoProducto,
                    as: 'subgrupoProducto',
                    attributes: ['nombre']
                },
                {
                    model: categoriaModel_1.Categoria,
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
            having: sequelize_1.Sequelize.literal('SUM(stocks.stock) > 0')
        });
        res.status(200).json({ value: productos });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getProductosConStock = getProductosConStock;
const getProductosConStockByUbicacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productos = yield productoModel_1.Producto.findAll({
            where: {
                estado: true, precioTiendita: {
                    [sequelize_1.Op.gt]: 0 // Filtra solo aquellos con precioTiendita mayor a 0
                }
            },
            include: [
                {
                    model: stockModel_1.Stock,
                    as: 'stocks',
                    attributes: [],
                    where: { idUbicacion: id }, // No incluir los campos de Stock directamente en el resultado
                }
            ],
            group: [
                'idProducto'
            ],
            having: sequelize_1.Sequelize.literal('SUM(stocks.stock) > 0')
        });
        res.status(200).json({ value: productos });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getProductosConStockByUbicacion = getProductosConStockByUbicacion;
const getProductosUndSinPrecio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        //const { idP, idU } = req.body;
        const productos = yield stockModel_1.Stock.findAll({
            where: {
                idBodega: id,
                stock: { [sequelize_1.Op.gt]: 0 },
            },
            attributes: ['idProducto',
                [(0, sequelize_1.fn)('SUM', sequelize_1.Sequelize.col('stock')), 'totalStock']],
            group: [
                'idProducto'
            ],
            include: [
                {
                    model: productoModel_1.Producto,
                    as: 'producto',
                    attributes: ['descripcion', 'precioTiendita', 'prest'], // Campos específicos de la tabla Productos
                    include: [
                        {
                            model: grupoProductoModel_1.GrupoProducto,
                            as: 'grupoProducto',
                            attributes: ['nombre'],
                        },
                        {
                            model: subgrupoProductoModel_1.SubgrupoProducto,
                            as: 'subgrupoProducto',
                            attributes: ['nombre'],
                        },
                    ],
                },
            ],
        });
        res.status(200).json({ status: true, value: productos });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getProductosUndSinPrecio = getProductosUndSinPrecio;
const getSalidaEntradaAnual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = new Date().getFullYear();
        const inicioAño = `${year}-01-01`;
        const finAño = `${year}-12-31`;
        const ingresos = yield ingresoModel_1.Ingreso.findAll({
            attributes: [
                [(0, sequelize_1.fn)('MONTH', (0, sequelize_1.col)('fecha')), 'mes'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('totalPeso')), 'totalPesoIng'],
            ],
            where: {
                fecha: {
                    [sequelize_1.Op.between]: [inicioAño, finAño],
                },
            },
            group: [(0, sequelize_1.fn)('MONTH', (0, sequelize_1.col)('fecha'))],
            raw: true, // Para que devuelva un objeto plano
        });
        const egresos = yield egresoModel_1.Egreso.findAll({
            attributes: [
                [(0, sequelize_1.fn)('MONTH', (0, sequelize_1.col)('fecha')), 'mes'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('totalPeso')), 'totalPesoEg'],
            ],
            where: {
                fecha: {
                    [sequelize_1.Op.between]: [inicioAño, finAño],
                },
            },
            group: [(0, sequelize_1.fn)('MONTH', (0, sequelize_1.col)('fecha'))],
            raw: true,
        });
        res.status(200).json({ status: true, value: { ingresos: ingresos, egresos: egresos } });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getSalidaEntradaAnual = getSalidaEntradaAnual;
const getProductoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const producto = yield productoModel_1.Producto.findByPk(id);
        if (!producto)
            res.status(404).json({
                status: false,
                message: 'Producto no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: producto
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getProductoById = getProductoById;
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const producto = req.body;
        const checkIs = yield productoModel_1.Producto.findByPk(producto.idProducto);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Producto no encontrado'
            });
            return;
        }
        if (producto.descripcion.toLocaleUpperCase() !=
            checkIs.descripcion.toLocaleUpperCase()) {
            const nameExist = yield productoModel_1.Producto.findOne({ where: { descripcion: producto.descripcion } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'La descripcion del producto ya existe'
                });
                return;
            }
        }
        ;
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
        yield checkIs.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del producto ${producto.descripcion}.`);
        res.status(200).json({
            status: true,
            message: 'Datos de producto actualizados exitosamente',
            value: checkIs
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateProducto = updateProducto;
const updatePrecios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const productos = req.body;
        if (!Array.isArray(productos) || productos.length === 0) {
            res.status(400).json({ status: false, message: 'Debe enviar una lista de productos válida.' });
            return;
        }
        const actualizaciones = productos.map((producto) => {
            return productoModel_1.Producto.update({ precioTiendita: producto.precioTiendita }, { where: { idProducto: producto.idProducto } });
        });
        yield Promise.all(actualizaciones);
        yield transaction.commit();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ACTUALIZACION_PRECIOS', entidad, `Se actualizaron los precios de los productos de Tiendita.`);
        res.json({
            status: true,
            message: 'Precios actualizados correctamente.'
        });
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updatePrecios = updatePrecios;
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const producto = yield productoModel_1.Producto.findByPk(id);
        if (!producto) {
            res.status(404).json({
                status: false,
                message: 'Producto no encontrado. Imposible eliminar.'
            });
            return;
        }
        producto.estado = false; // Marcar como anulado
        yield producto.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el producto ${producto.descripcion}.`);
        res.status(200).json({
            status: true,
            message: 'Producto eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteProducto = deleteProducto;
