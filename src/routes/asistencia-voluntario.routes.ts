import { Router } from "express";
import { create, getAllByDate, getAll, getById, update, deleteById, importJson, getUltimaFecha } from "../controllers/asistencia-voluntario.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.post('/importJson', checkJwt, importJson);
router.post('/getAllByDate', checkJwt, getAllByDate);
router.put('/', checkJwt, update);
router.get('/getLastDate', checkJwt, getUltimaFecha);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);
router.delete('/:id', checkJwt, deleteById);

export default router;