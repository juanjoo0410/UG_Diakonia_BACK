import { Router } from "express";
import {
    createEstablecimiento,
    getEstablecimientos,
    getEstablecimientoById,
    updateEstablecimiento,
    deleteEstablecimiento,
    importJson
} from "../controllers/establecimientoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createEstablecimiento);
router.get('/', checkJwt, getEstablecimientos);
router.get('/:id', checkJwt, getEstablecimientoById);
router.put('/', checkJwt, updateEstablecimiento);
router.delete('/:id', checkJwt, deleteEstablecimiento);
router.post('/importJson', checkJwt, importJson);

export default router;