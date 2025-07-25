import { Router } from "express";
import {
    create,
    getAll,
    getTotal,
    getTotalBeneficiariosByInstituciones,
    getById,
    update,
    updateStatus,
    importJson
} from "../controllers/institucionController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, create);
router.get('/', checkJwt, getAll);
router.get('/total', checkJwt, getTotal);
router.get('/byInstitucion', checkJwt, getTotalBeneficiariosByInstituciones);
router.get('/:id', checkJwt, getById);
router.put('/', checkJwt, update);
router.delete('/:id', checkJwt, updateStatus);
router.post('/importJson', checkJwt, importJson);

export default router;