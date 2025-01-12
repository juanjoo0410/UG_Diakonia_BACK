import { Router } from 'express';
import { getBitacora, getAcciones, getEntidades } from '../controllers/bitacoraController';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.get('/acciones', checkJwt, getAcciones);
router.get('/entidades', checkJwt, getEntidades);
router.post('/', checkJwt, getBitacora);

export default router;