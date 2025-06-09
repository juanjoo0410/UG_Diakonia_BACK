import { Router, Request, Response } from 'express';
import {
    getStock,
    getStockVentas,
    getStockProductoByUbicacion
} from '../controllers/stockController';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.get('/', checkJwt, getStock);
router.get('/ventas', checkJwt, getStockVentas);
router.get('/producto/:idP/:idU', checkJwt, getStockProductoByUbicacion);

export default router;