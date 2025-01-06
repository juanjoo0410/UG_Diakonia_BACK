import { Router } from "express";
import {
    createEgreso,
    getEgresos,
    getEgresoById
} from "../controllers/egresoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createEgreso);
router.get('/', checkJwt, getEgresos);
router.get('/:id', checkJwt, getEgresoById);

export default router;