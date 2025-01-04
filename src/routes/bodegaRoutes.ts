import { Router } from "express";
import {
    createBodega,
    getBodegas,
    getBodegaById,
    updateBodega,
    deleteBodega
} from "../controllers/bodegaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createBodega);
router.get('/', checkJwt, getBodegas);
router.get('/:id', checkJwt, getBodegaById);
router.put('/', checkJwt, updateBodega);
router.delete('/:id', checkJwt, deleteBodega);

export default router;