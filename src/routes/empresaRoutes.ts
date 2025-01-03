import { Router } from 'express';
import {
    createEmpresa,
    getEmpresa,
    updateEmpresa
} from '../controllers/empresaController';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.post('/', checkJwt, createEmpresa);
router.put('/', checkJwt, updateEmpresa);
router.get('/', checkJwt, getEmpresa);

export default router;