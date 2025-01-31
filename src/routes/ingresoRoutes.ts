import { Router } from "express";
import {
    createIngreso,
    getIngresos,
    getIngresoById,
    deleteIngreso
} from "../controllers/ingresoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createIngreso);
router.post('/fecha', checkJwt, getIngresos);
router.get('/:id', checkJwt, getIngresoById);
router.delete('/:id', checkJwt, deleteIngreso);

export default router;