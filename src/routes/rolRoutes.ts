import { Router, Request, Response } from 'express';
import {
    createRol,
    getRoles,
    getRolById,
    updateRol,
    deleteRol
} from '../controllers/rolController';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.post('/', checkJwt, createRol);
router.get('/', checkJwt, getRoles);
router.get('/:id', getRolById);
router.put('/', checkJwt, updateRol);
router.delete('/:idRol', checkJwt, deleteRol);

export default router;
