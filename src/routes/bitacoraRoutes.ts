import { Router } from 'express';
import { getBitacora } from '../controllers/bitacoraController';

const router = Router();

router.get('/', getBitacora);

export default router;