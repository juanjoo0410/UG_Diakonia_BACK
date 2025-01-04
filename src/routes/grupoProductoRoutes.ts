import { Router } from "express";
import {
    createGrupoProducto,
    getGruposProducto,
    getGrupoProductoById,
    updateGrupoProducto,
    deleteGrupoProducto
} from "../controllers/grupoProductoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createGrupoProducto);
router.get('/', checkJwt, getGruposProducto);
router.get('/:id', checkJwt, getGrupoProductoById);
router.put('/', checkJwt, updateGrupoProducto);
router.delete('/:id', checkJwt, deleteGrupoProducto);

export default router;