import { Router } from "express";
import {
    createComprobanteVenta,
    getComprobantesVenta,
    getVentasByTipoPago,
    getComprobanteVentaById
} from "../controllers/comprobanteVentaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createComprobanteVenta);
router.post('/fecha', checkJwt, getComprobantesVenta);
router.get('/ventas', checkJwt, getVentasByTipoPago);
router.get('/:id', checkJwt, getComprobanteVentaById);

export default router;