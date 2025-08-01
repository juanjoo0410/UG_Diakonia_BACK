import { Router } from "express";
import {
    getAll
} from "../controllers/mapeoController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.get('/', checkJwt, getAll);

export default router;