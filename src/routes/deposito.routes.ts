import { Router } from "express";
import { create, getAll, getById, getDepositosByDateAndBancoId, getIngresosForDeposito, getPapeleta } from "../controllers/deposito.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.post('/ingresos', checkJwt, getIngresosForDeposito);
router.post('/depositos', checkJwt, getDepositosByDateAndBancoId);
router.get('/', checkJwt, getAll);
router.get('/papeleta', checkJwt, getPapeleta);
router.get('/:id', checkJwt, getById);

export default router;