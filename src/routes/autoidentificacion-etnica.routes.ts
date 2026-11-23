import { Router } from "express";
import { getAll, getById } from "../controllers/autoidentificacion-etnica.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);

export default router;