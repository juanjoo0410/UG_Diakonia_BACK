import { Router } from "express";
import {
    createEstablecimiento,
    getEstablecimientos,
    getEstablecimientoById,
    updateEstablecimiento,
    deleteEstablecimiento
} from "../controllers/establecimientoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createEstablecimiento);
router.get('/', checkJwt, getEstablecimientos);
router.get('/:id', checkJwt, getEstablecimientoById);
router.put('/', checkJwt, updateEstablecimiento);
router.delete('/:id', checkJwt, deleteEstablecimiento);

export default router;