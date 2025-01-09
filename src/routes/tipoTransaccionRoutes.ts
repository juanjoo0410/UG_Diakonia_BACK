import { Router } from "express";
import {
    createTipoTransaccion,
    getTiposTransaccion,
    getTiposTransaccionByIngreso,
    getTiposTransaccionByEgreso,
    getTipoTransaccionById,
    updateTipoTransaccion,
    deleteTipoTransaccion
} from "../controllers/tipoTransaccionController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createTipoTransaccion);
router.get('/', checkJwt, getTiposTransaccion);
router.get('/ingreso/', checkJwt, getTiposTransaccionByIngreso);
router.get('/egreso/', checkJwt, getTiposTransaccionByEgreso);
router.get('/:id', checkJwt, getTipoTransaccionById);
router.put('/', checkJwt, updateTipoTransaccion);
router.delete('/:id', checkJwt, deleteTipoTransaccion);

export default router;