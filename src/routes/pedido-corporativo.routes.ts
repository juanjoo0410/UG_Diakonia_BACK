import { Router } from "express";
import { annular, create, getAll, getById } from "../controllers/pedido-corporativo.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.get('/', checkJwt, getAll);
router.get('/:id', checkJwt, getById);
router.delete('/:id', checkJwt, annular);

export default router;