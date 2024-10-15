import { Router } from "express";
import { createUsuario } from "../controllers/usuarioController";

const router = Router();

router.post('/', createUsuario);

export default router;