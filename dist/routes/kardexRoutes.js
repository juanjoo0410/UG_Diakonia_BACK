"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kardexController_1 = require("../controllers/kardexController");
const router = (0, express_1.Router)();
router.post('/', kardexController_1.getKardex);
exports.default = router;
