import { Router } from "express";
import {
    createTransferencia,
    getTransferencias,
    getTransferenciaById,
    deleteTransferenia
} from "../controllers/transferenciaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createTransferencia);
router.post('/fecha', checkJwt, getTransferencias);
router.get('/:id', checkJwt, getTransferenciaById);
router.delete('/:id', checkJwt, deleteTransferenia);

export default router;