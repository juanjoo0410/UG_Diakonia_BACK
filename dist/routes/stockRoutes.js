"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.get('/', session_1.checkJwt, stockController_1.getStock);
router.get('/producto/:idP/:idU', session_1.checkJwt, stockController_1.getStockProductoByUbicacion);
exports.default = router;
