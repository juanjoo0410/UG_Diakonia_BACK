"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menuController_1 = require("../controllers/menuController");
const router = (0, express_1.Router)();
router.post('/', menuController_1.createMenu);
router.get('/', menuController_1.getMenus);
router.get('/:id', menuController_1.getMenuById);
router.put('/:id', menuController_1.updateMenu);
router.delete('/:id', menuController_1.deleteMenu);
exports.default = router;
