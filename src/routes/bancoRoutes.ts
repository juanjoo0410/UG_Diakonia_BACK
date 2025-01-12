import { Router } from "express";
import { getBancos } from "../controllers/bancoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.get('/', checkJwt, getBancos);

export default router;