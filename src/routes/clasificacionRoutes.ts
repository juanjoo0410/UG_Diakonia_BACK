import { Router } from "express";
import {
    createidClasificacion,
    getidClasificaciones,
    getidClasificacionById,
    updateidClasificacion,
    deleteidClasificacion
} from "../controllers/clasificacionController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createidClasificacion);
router.get('/', checkJwt, getidClasificaciones);
router.get('/:id', checkJwt, getidClasificacionById);
router.put('/', checkJwt, updateidClasificacion);
router.delete('/:id', checkJwt, deleteidClasificacion);

export default router;