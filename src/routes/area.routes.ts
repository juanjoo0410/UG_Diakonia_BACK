import { Router } from "express";
import { create, update, updateStatus, getAll, getById } from "../controllers/area.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.put('/', checkJwt, update);
router.delete('/:id', checkJwt, updateStatus);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);

export default router;