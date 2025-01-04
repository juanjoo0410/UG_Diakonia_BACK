import { Router } from "express";
import {
    createUbicacion,
    getUbicaciones,
    getUbicacionById,
    updateUbicacion,
    deleteUbicacion
} from "../controllers/ubicacionController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createUbicacion);
router.get('/', checkJwt, getUbicaciones);
router.get('/:id', checkJwt, getUbicacionById);
router.put('/', checkJwt, updateUbicacion);
router.delete('/:id', checkJwt, deleteUbicacion);

export default router;