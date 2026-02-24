import { Router } from "express";
import { checkJwt } from "../middlewares/session";
import { getPermisosByRol } from "../controllers/rol-permiso.controller";

const router = Router();

router.get('/:idRol', checkJwt, getPermisosByRol);

export default router;