"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/', authController_1.login);
router.post('/change', authController_1.changePassword);
router.post('/forgot', authController_1.forgotPassword);
exports.default = router;
