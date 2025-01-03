import { Router, Request, Response } from 'express';
import {
    getIdSubmenusByIdRol,
    getPermisosByIdRol
} from '../controllers/rolSubmenuController';

const router = Router();

router.get('/:idRol', getPermisosByIdRol);
router.get('/idSubmenus/:idRol', getIdSubmenusByIdRol);

export default router;