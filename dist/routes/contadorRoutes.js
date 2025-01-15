"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contadorController_1 = require("../controllers/contadorController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.post('/', session_1.checkJwt, contadorController_1.createContador);
router.get('/', session_1.checkJwt, contadorController_1.getContadores);
exports.default = router;
