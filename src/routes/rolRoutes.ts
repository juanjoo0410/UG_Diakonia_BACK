import { Router, Request, Response } from 'express';
import { createRol } from '../controllers/rolController';

const router = Router();

router.post('/', createRol);

export default router;
