import { Router } from "express";
import {
    createClaseTipoOrg,
    getClasesTipoOrg,
    getClaseTipoOrgById,
    updateClaseTipoOrg,
    deleteClaseTipoOrg
} from "../controllers/claseTipoOrgController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createClaseTipoOrg);
router.get('/', checkJwt, getClasesTipoOrg);
router.get('/:id', checkJwt, getClaseTipoOrgById);
router.put('/', checkJwt, updateClaseTipoOrg);
router.delete('/:id', checkJwt, deleteClaseTipoOrg);

export default router;