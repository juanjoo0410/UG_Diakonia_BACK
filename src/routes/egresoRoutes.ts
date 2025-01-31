import { Router } from "express";
import {
    createEgreso,
    getEgresos,
    getEgresoById,
    deleteEgreso
} from "../controllers/egresoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createEgreso);
router.post('/fecha', checkJwt, getEgresos);
router.get('/:id', checkJwt, getEgresoById);
router.delete('/:id', checkJwt, deleteEgreso);

export default router;