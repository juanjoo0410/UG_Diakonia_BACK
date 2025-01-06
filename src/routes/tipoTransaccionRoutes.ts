import { Router } from "express";
import {
    createTipoTransaccion,
    getTiposTransaccion,
    getTipoTransaccionById,
    updateTipoTransaccion,
    deleteTipoTransaccion
} from "../controllers/tipoTransaccionController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createTipoTransaccion);
router.get('/', checkJwt, getTiposTransaccion);
router.get('/:id', checkJwt, getTipoTransaccionById);
router.put('/', checkJwt, updateTipoTransaccion);
router.delete('/:id', checkJwt, deleteTipoTransaccion);

export default router;