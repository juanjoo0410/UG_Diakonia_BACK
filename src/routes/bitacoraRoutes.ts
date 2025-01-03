import { Router } from 'express';
import { getBitacora } from '../controllers/bitacoraController';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.get('/', checkJwt, getBitacora);

export default router;