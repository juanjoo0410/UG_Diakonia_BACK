import { Router } from "express";
import {
    createBeneficiario,
    getBeneficiarios,
    getBeneficiarioById,
    updateBeneficiario,
    deleteBeneficiario
} from "../controllers/beneficiarioController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createBeneficiario);
router.get('/', checkJwt, getBeneficiarios);
router.get('/:id', checkJwt, getBeneficiarioById);
router.put('/', checkJwt, updateBeneficiario);
router.delete('/:id', checkJwt, deleteBeneficiario);

export default router;