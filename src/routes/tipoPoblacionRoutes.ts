import { Router } from "express";
import {
    createTipoPoblacion,
    getTiposPoblacion,
    getTipoPoblacionById,
    updateTipoPoblacion,
    deleteTipoPoblacion
} from "../controllers/tipoPoblacionController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createTipoPoblacion);
router.get('/', checkJwt, getTiposPoblacion);
router.get('/:id', checkJwt, getTipoPoblacionById);
router.put('/', checkJwt, updateTipoPoblacion);
router.delete('/:id', checkJwt, deleteTipoPoblacion);

export default router;