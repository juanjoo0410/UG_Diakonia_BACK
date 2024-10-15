import { Router, Request, Response } from 'express';
import { createRol, getRoles, getRolById, updateRol, deleteRol } from '../controllers/rolController';

const router = Router();

router.post('/', createRol);
router.get('/', getRoles);
router.get('/:id', getRolById);
router.put('/:id', updateRol);
router.delete('/:id', deleteRol);

export default router;
