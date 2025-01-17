import { Router } from "express";
import {
    createBeneficiario,
    getBeneficiarios,
    getTotalBeneficiarios,
    getTotalBeneficiariosByInstituciones,
    getBeneficiarioById,
    updateBeneficiario,
    deleteBeneficiario
} from "../controllers/beneficiarioController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createBeneficiario);
router.get('/', checkJwt, getBeneficiarios);
router.get('/total', checkJwt, getTotalBeneficiarios);
router.get('/byInstitucion', checkJwt, getTotalBeneficiariosByInstituciones);
router.get('/:id', checkJwt, getBeneficiarioById);
router.put('/', checkJwt, updateBeneficiario);
router.delete('/:id', checkJwt, deleteBeneficiario);

export default router;