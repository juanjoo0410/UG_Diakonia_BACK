import { Router } from "express";
import {
    createIngreso,
    getIngresos,
    getIngresoById
} from "../controllers/ingresoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createIngreso);
router.get('/', checkJwt, getIngresos);
router.get('/:id', checkJwt, getIngresoById);

export default router;