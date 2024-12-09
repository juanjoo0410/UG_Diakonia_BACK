import { Router } from "express";
import { changePassword, login } from "../controllers/authController";

const router = Router();

router.post('/', login);
router.post('/change', changePassword);

export default router;