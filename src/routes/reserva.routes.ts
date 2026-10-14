import { Router } from "express";
import { checkJwt } from "../middlewares/session";
import { getAll } from "../controllers/reserva.controller";

const router = Router();

router.get('/', checkJwt, getAll);

export default router;