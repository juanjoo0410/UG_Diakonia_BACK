import { Router } from "express";
import { createUsuario, getUsuarios, getUsuarioById, updateUsuario, deleteUsuario } from "../controllers/usuarioController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createUsuario);
router.get('/', checkJwt, getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;