"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bancoController_1 = require("../controllers/bancoController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.get('/', session_1.checkJwt, bancoController_1.getBancos);
exports.default = router;
