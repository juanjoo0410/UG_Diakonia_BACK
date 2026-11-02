import { Router } from "express";
import {
    createComprobanteVenta,
    getComprobantesVenta,
    getTotalVentasMensual,
    getVentasByTipoPago,
    getProductosDemandantes,
    getComprobanteVentaById,
    deleteComprobanteVenta,
    getTotalProductos,
    getTotalContribucionAnual,
    getComprobantesContribucionByDate,
    getTotalVentasSemanal,
    getVentasByTipoPagoSemanal,
    getProductosDemandantesSemanal
} from "../controllers/comprobanteVentaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createComprobanteVenta);
router.post('/fecha', checkJwt, getComprobantesVenta);
router.post('/ventas', checkJwt, getVentasByTipoPago);
router.post('/ventas-semanal', checkJwt, getVentasByTipoPagoSemanal);
router.post('/total', checkJwt, getTotalVentasMensual);
router.post('/total-semanal', checkJwt, getTotalVentasSemanal);
router.post('/total-anual', checkJwt, getTotalContribucionAnual);
router.post('/productos-demandantes', checkJwt, getProductosDemandantes);
router.post('/productos-demandantes-semanal', checkJwt, getProductosDemandantesSemanal);
router.post('/total-productos', checkJwt, getTotalProductos);
router.post('/comprobantes-contribucion', checkJwt, getComprobantesContribucionByDate);
router.get('/:id', checkJwt, getComprobanteVentaById);
router.delete('/:id', checkJwt, deleteComprobanteVenta);

export default router;