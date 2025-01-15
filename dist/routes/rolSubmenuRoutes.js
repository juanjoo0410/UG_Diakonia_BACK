"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolSubmenuController_1 = require("../controllers/rolSubmenuController");
const router = (0, express_1.Router)();
router.get('/:idRol', rolSubmenuController_1.getPermisosByIdRol);
router.get('/idSubmenus/:idRol', rolSubmenuController_1.getIdSubmenusByIdRol);
exports.default = router;
