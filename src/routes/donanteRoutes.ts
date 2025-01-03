import { Router } from "express";
import {
    createDonante,
    getDonantes,
    getDonanteById,
    updateDonante,
    deleteDonante
} from "../controllers/donanteController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createDonante);
router.get('/', checkJwt, getDonantes);
router.get('/:id', checkJwt, getDonanteById);
router.put('/', checkJwt, updateDonante);
router.delete('/:id', checkJwt, deleteDonante);

export default router;