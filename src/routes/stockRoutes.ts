import { Router, Request, Response } from 'express';
import {
    getStock,
    getStockProductoByUbicacion
} from '../controllers/stockController';

const router = Router();

router.get('/', getStock);
router.get('/producto/:idP/:idU', getStockProductoByUbicacion);

export default router;