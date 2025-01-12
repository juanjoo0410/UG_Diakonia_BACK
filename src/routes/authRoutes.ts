import { Router } from "express";
import { changePassword, login, forgotPassword } from "../controllers/authController";

const router = Router();

router.post('/', login);
router.post('/change', changePassword);
router.post('/forgot', forgotPassword);

export default router;