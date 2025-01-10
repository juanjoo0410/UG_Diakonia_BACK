import { Router } from "express";
import {
    createProducto,
    getProductos,
    getProductosConStock,
    getProductosConStockByBodega,
    getProductoById,
    updateProducto,
    deleteProducto
} from "../controllers/productoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createProducto);
router.get('/', checkJwt, getProductos);
router.get('/conStock', checkJwt, getProductosConStock);
router.get('/byBodega/:id', checkJwt, getProductosConStockByBodega);
router.get('/:id', checkJwt, getProductoById);
router.put('/', checkJwt, updateProducto);
router.delete('/:id', checkJwt, deleteProducto);

export default router;