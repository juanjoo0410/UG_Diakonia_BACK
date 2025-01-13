import { Router, Request, Response } from 'express';
import {
    getKardex
} from '../controllers/kardexController';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.post('/', checkJwt, getKardex);

export default router;