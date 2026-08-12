import { Router } from "express";
import { create, getAll, getById } from "../controllers/ingreso-tesoreria.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);

export default router;