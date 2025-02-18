import { Router } from "express";
import {
    createCategoria,
    getCategorias,
    getCategoriasByIdSubgrupo,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
} from "../controllers/categoriaController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createCategoria);
router.get('/', checkJwt, getCategorias);
router.get('/subgrupo/:id', checkJwt, getCategoriasByIdSubgrupo);
router.get('/:id', checkJwt, getCategoriaById);
router.put('/', checkJwt, updateCategoria);
router.delete('/:id', checkJwt, deleteCategoria);

export default router;