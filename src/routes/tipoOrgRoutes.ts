import { Router } from "express";
import {
    createTipoORg,
    getTiposOrg,
    getTipoOrgById,
    updateTipoOrg,
    deleteTipoOrg
} from "../controllers/tipoOrgController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createTipoORg);
router.get('/', checkJwt, getTiposOrg);
router.get('/:id', checkJwt, getTipoOrgById);
router.put('/', checkJwt, updateTipoOrg);
router.delete('/:id', checkJwt, deleteTipoOrg);

export default router;