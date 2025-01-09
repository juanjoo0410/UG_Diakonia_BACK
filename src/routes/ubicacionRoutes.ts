import { Router } from "express";
import {
    createUbicacion,
    getUbicaciones,
    getUbicacionesByIdBodega,
    getUbicacionById,
    getEspacioDisponible,
    updateUbicacion,
    deleteUbicacion
} from "../controllers/ubicacionController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createUbicacion);
router.get('/', checkJwt, getUbicaciones);
router.get('/bodega/:id', checkJwt, getUbicacionesByIdBodega);
router.get('/:id', checkJwt, getUbicacionById);
router.get('/disponible/:id', checkJwt, getEspacioDisponible);
router.put('/', checkJwt, updateUbicacion);
router.delete('/:id', checkJwt, deleteUbicacion);

export default router;