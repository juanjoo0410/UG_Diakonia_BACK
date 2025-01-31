import { Router } from "express";
import {
    createComprobanteVenta,
    getComprobantesVenta,
    getTotalVentasMensual,
    getVentasByTipoPago,
    getComprobanteVentaById,
    deleteComprobanteVenta
} from "../controllers/comprobanteVentaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createComprobanteVenta);
router.post('/fecha', checkJwt, getComprobantesVenta);
router.get('/ventas', checkJwt, getVentasByTipoPago);
router.get('/total', checkJwt, getTotalVentasMensual);
router.get('/:id', checkJwt, getComprobanteVentaById);
router.delete('/:id', checkJwt, deleteComprobanteVenta);

export default router;