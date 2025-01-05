import { Router } from "express";
import {
    createCliente,
    getClientes,
    getClienteById,
    updateCliente,
    deleteCliente
} from "../controllers/clienteController";
import { checkJwt } from "../middlewares/session";

const router = Router();

router.post('/', checkJwt, createCliente);
router.get('/', checkJwt, getClientes);
router.get('/:id', checkJwt, getClienteById);
router.put('/', checkJwt, updateCliente);
router.delete('/:id', checkJwt, deleteCliente);

export default router;