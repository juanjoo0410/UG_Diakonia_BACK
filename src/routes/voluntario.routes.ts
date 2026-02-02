import { Router } from "express";
import { create, update, updateStatus, getAll, getById, getTotalRegistros, importJson } from "../controllers/voluntario.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.post('/importJson', checkJwt, importJson);
router.put('/', checkJwt, update);
router.delete('/:id', checkJwt, updateStatus);
router.get('/', checkJwt, getAll);
router.get('/count', checkJwt, getTotalRegistros);
router.get('/:id', checkJwt, getById);


export default router;