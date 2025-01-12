import { Router, Request, Response } from 'express';
import {
    getKardex
} from '../controllers/kardexController';

const router = Router();

router.post('/', getKardex);

export default router;