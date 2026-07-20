import { Router } from "express";
import { upsertByFecha, getAll, getByFecha, getEstadoCajasByFecha, aperturar, getByCajaIdAndFecha } from "../controllers/apertura-cierre.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/aperturar', checkJwt, aperturar);
router.post('/upsert', checkJwt, upsertByFecha);
router.get('/', checkJwt, getAll);
router.get('/estado-cajas/:fecha', checkJwt, getEstadoCajasByFecha);
router.get('/caja/:cajaId/fecha/:fecha', checkJwt, getByCajaIdAndFecha);
router.get('/:id', checkJwt, getByFecha);

export default router;