import { Router } from "express";
import { upsertByFecha, getAll, getByFecha } from "../controllers/apertura.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/upsert', checkJwt, upsertByFecha);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getByFecha);

export default router;