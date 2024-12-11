import { Router, Request, Response } from 'express';
import { getPermisosByIdRol } from '../controllers/rolSubmenuController';

const router = Router();

router.get('/:idRol', getPermisosByIdRol);

export default router;