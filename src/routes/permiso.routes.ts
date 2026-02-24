import { Router } from "express";
import { updateStatus, getAll, getById } from "../controllers/permiso.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.delete('/:id', checkJwt, updateStatus);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);

export default router;