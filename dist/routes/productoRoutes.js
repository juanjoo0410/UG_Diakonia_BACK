"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoController_1 = require("../controllers/productoController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.post('/', session_1.checkJwt, productoController_1.createProducto);
router.get('/', session_1.checkJwt, productoController_1.getProductos);
router.get('/conStock', session_1.checkJwt, productoController_1.getProductosConStock);
router.get('/byUbicacion/:id', session_1.checkJwt, productoController_1.getProductosConStockByUbicacion);
router.get('/:id', session_1.checkJwt, productoController_1.getProductoById);
router.put('/', session_1.checkJwt, productoController_1.updateProducto);
router.delete('/:id', session_1.checkJwt, productoController_1.deleteProducto);
exports.default = router;
