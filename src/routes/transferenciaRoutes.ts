import { Router } from "express";
import {
    createTransferencia,
    getTransferencias,
    getTransferenciaById
} from "../controllers/transferenciaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createTransferencia);
router.get('/', checkJwt, getTransferencias);
router.get('/:id', checkJwt, getTransferenciaById);

export default router;