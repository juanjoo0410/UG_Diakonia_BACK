import { Router } from "express";
import { create, getAllByDate, getAll, getById } from "../controllers/asistencia-voluntario.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.post('/getAllByDate', checkJwt, getAllByDate);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);

export default router;