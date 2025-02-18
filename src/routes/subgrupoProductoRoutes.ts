import { Router } from "express";
import {
    createSubgrupoProducto,
    getSubgruposProducto,
    getSubgruposByIdGrupo,
    getSubgrupoProductoById,
    updateSubgrupoProducto,
    deleteSubgrupoProducto
} from "../controllers/subgrupoProductoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createSubgrupoProducto);
router.get('/', checkJwt, getSubgruposProducto);
router.get('/:idGrupo', checkJwt, getSubgruposByIdGrupo);
router.get('/:id', checkJwt, getSubgrupoProductoById);
router.put('/', checkJwt, updateSubgrupoProducto);
router.delete('/:id', checkJwt, deleteSubgrupoProducto);

export default router;