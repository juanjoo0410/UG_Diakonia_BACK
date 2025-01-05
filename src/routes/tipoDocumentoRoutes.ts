import { Router } from "express";
import {
    createTipoDocumento,
    getTiposDocumento,
    getTipoDocumentoById,
    updateTipoDocumento,
    deleteTipoDocumento
} from "../controllers/tipoDocumentoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createTipoDocumento);
router.get('/', checkJwt, getTiposDocumento);
router.get('/:id', checkJwt, getTipoDocumentoById);
router.put('/', checkJwt, updateTipoDocumento);
router.delete('/:id', checkJwt, deleteTipoDocumento);

export default router;