import { Router } from "express";
import {
    create,
    getAll,
    getById,
    update,
    updateStatus
} from "../controllers/proyectoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);
router.put('/', checkJwt, update);
router.delete('/:id', checkJwt, updateStatus);

export default router;