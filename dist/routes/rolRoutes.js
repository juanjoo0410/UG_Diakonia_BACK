"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolController_1 = require("../controllers/rolController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.post('/', session_1.checkJwt, rolController_1.createRol);
router.get('/', session_1.checkJwt, rolController_1.getRoles);
router.get('/:id', rolController_1.getRolById);
router.put('/', session_1.checkJwt, rolController_1.updateRol);
router.delete('/:idRol', session_1.checkJwt, rolController_1.deleteRol);
exports.default = router;