import { Router, Request, Response } from 'express';
import { createRol, getRoles, getRolById, updateRol, deleteRol } from '../controllers/rolController';
import { checkJwt } from '../middlewares/session';

const router = Router();

router.post('/', createRol);
router.get('/', checkJwt, getRoles);
router.get('/:id', getRolById);
router.put('/:id', updateRol);
router.delete('/:id', deleteRol);

export default router;
