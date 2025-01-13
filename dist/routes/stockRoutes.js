"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
const router = (0, express_1.Router)();
router.get('/', stockController_1.getStock);
router.get('/producto/:idP/:idU', stockController_1.getStockProductoByUbicacion);
exports.default = router;
