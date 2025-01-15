"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subgrupoProductoController_1 = require("../controllers/subgrupoProductoController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.post('/', session_1.checkJwt, subgrupoProductoController_1.createSubgrupoProducto);
router.get('/', session_1.checkJwt, subgrupoProductoController_1.getSubgruposProducto);
router.get('/:idGrupo', session_1.checkJwt, subgrupoProductoController_1.getSubgruposByIdGrupo);
router.get('/:id', session_1.checkJwt, subgrupoProductoController_1.getSubgrupoProductoById);
router.put('/', session_1.checkJwt, subgrupoProductoController_1.updateSubgrupoProducto);
router.delete('/:id', session_1.checkJwt, subgrupoProductoController_1.deleteSubgrupoProducto);
exports.default = router;
