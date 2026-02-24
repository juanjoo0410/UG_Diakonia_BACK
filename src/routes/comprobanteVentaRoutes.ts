import { Router } from "express";
import {
    createComprobanteVenta,
    getComprobantesVenta,
    getTotalVentasMensual,
    getVentasByTipoPago,
    getProductosDemandantes,
    getComprobanteVentaById,
    deleteComprobanteVenta,
    getTotalProductos
} from "../controllers/comprobanteVentaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createComprobanteVenta);
router.post('/fecha', checkJwt, getComprobantesVenta);
router.post('/ventas', checkJwt, getVentasByTipoPago);
router.post('/total', checkJwt, getTotalVentasMensual);
router.post('/productos-demandantes', checkJwt, getProductosDemandantes);
router.post('/total-productos', checkJwt, getTotalProductos);
router.get('/:id', checkJwt, getComprobanteVentaById);
router.delete('/:id', checkJwt, deleteComprobanteVenta);

export default router;