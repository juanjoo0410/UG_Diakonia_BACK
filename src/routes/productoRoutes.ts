import { Router } from "express";
import {
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
    deleteProducto
} from "../controllers/productoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createProducto);
router.get('/', checkJwt, getProductos);
router.get('/total', checkJwt, getTotalProductos);
router.get('/conStock', checkJwt, getProductosConStock);
router.get('/byUbicacion/:id', checkJwt, getProductosConStockByUbicacion);
router.get('/sinPrecio/:id', checkJwt, getProductosUndSinPrecio);
router.get('/planificacion/:id', checkJwt, getProductosPlanificacion);
router.get('/anual', checkJwt, getSalidaEntradaAnual);
router.get('/topVencidos', checkJwt, getProductosTopVencidos);
router.get('/:id', checkJwt, getProductoById);
router.put('/', checkJwt, updateProducto);
router.put('/precios', checkJwt, updatePrecios);
router.delete('/:id', checkJwt, deleteProducto);

export default router;