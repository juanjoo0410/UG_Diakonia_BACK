"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const donanteController_1 = require("../controllers/donanteController");
const session_1 = require("../middlewares/session");
const router = (0, express_1.Router)();
router.post('/', session_1.checkJwt, donanteController_1.createDonante);
router.get('/', session_1.checkJwt, donanteController_1.getDonantes);
router.get('/total', session_1.checkJwt, donanteController_1.getTotalDonantes);
router.get('/:id', session_1.checkJwt, donanteController_1.getDonanteById);
router.put('/', session_1.checkJwt, donanteController_1.updateDonante);
router.delete('/:id', session_1.checkJwt, donanteController_1.deleteDonante);
exports.default = router;