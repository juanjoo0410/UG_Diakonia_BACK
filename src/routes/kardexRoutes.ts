import { Router, Request, Response } from 'express';
import {
    getKardex
} from '../controllers/kardexController';

const router = Router();

router.get('/', getKardex);

export default router;