import { Router } from "express";
import {
    createContador,
    getContadores
} from "../controllers/contadorController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createContador);
router.get('/', checkJwt, getContadores);

export default router;