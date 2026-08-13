import { Router } from "express";
import { upsertByFecha, getAll, getByFecha, getEstadoCajasByFecha, aperturar, getByCajaIdAndFecha, getContribucionesCierreByDateAndCajaId, getEgresosCierreByDateAndCajaId, cerrar, getAperturaCierreByDateAndCajaId } from "../controllers/apertura-cierre.controller";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/aperturar', checkJwt, aperturar);
router.post('/cerrar', checkJwt, cerrar);
router.post('/upsert', checkJwt, upsertByFecha);
router.post('/aperturas-cierres', checkJwt, getAperturaCierreByDateAndCajaId);
router.get('/', checkJwt, getAll);
router.get('/contribuciones-cierre', checkJwt, getContribucionesCierreByDateAndCajaId);
router.get('/egresos-cierre', checkJwt, getEgresosCierreByDateAndCajaId);
router.get('/estado-cajas/:fecha', checkJwt, getEstadoCajasByFecha);
router.get('/caja/:cajaId/fecha/:fecha', checkJwt, getByCajaIdAndFecha);
router.get('/:id', checkJwt, getByFecha);

export default router;