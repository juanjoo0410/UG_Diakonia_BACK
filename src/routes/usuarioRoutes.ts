import { Router } from "express";
import {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario
} from "../controllers/usuarioController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createUsuario);
router.get('/', checkJwt, getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/', checkJwt, updateUsuario);
router.delete('/:id', checkJwt, deleteUsuario);

export default router;