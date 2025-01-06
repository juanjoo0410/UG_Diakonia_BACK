import { Router, Request, Response } from 'express';
import {
    getStock
} from '../controllers/stockController';

const router = Router();

router.get('/', getStock);

export default router;