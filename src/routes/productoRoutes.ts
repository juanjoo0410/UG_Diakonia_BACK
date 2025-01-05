import { Router } from "express";
import {
    createProducto,
    getProductos,
    getProductoById,
    updateProducto,
    deleteProducto
} from "../controllers/productoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createProducto);
router.get('/', checkJwt, getProductos);
router.get('/:id', checkJwt, getProductoById);
router.put('/', checkJwt, updateProducto);
router.delete('/:id', checkJwt, deleteProducto);

export default router;