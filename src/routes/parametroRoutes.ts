import { Router } from "express";
import {
    createParametro,
    getParametros,
    getParametroById,
    getParametroByCodigo,
    updateParametro,
    deleteParametro,
} from "../controllers/parametroController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createParametro);
router.get('/', checkJwt, getParametros);
router.get('/:id', checkJwt, getParametroById);
router.get('/codigo/:codigo', checkJwt, getParametroByCodigo);
router.put('/', checkJwt, updateParametro);
router.delete('/:id', checkJwt, deleteParametro);

export default router;