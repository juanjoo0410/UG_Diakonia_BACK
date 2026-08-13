import { Router } from "express";
import { annular, create, getAll, getById, getValesCajaByDate } from "../controllers/egreso-tesoreria.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.post('/vales-caja', checkJwt, getValesCajaByDate);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);
router.delete('/:id', checkJwt, annular);

export default router;