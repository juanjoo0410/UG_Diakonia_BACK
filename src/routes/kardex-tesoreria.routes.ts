import { Router } from "express";
import { getAll } from "../controllers/kardex-tesoreria.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.get('/', checkJwt, getAll);

export default router;