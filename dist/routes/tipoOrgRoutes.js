"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoOrgController_1 = require("../controllers/tipoOrgController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.post('/', session_1.checkJwt, tipoOrgController_1.createTipoOrg);
router.get('/', session_1.checkJwt, tipoOrgController_1.getTiposOrg);
router.get('/:id', session_1.checkJwt, tipoOrgController_1.getTipoOrgById);
router.put('/', session_1.checkJwt, tipoOrgController_1.updateTipoOrg);
router.delete('/:id', session_1.checkJwt, tipoOrgController_1.deleteTipoOrg);
exports.default = router;