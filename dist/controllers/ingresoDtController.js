"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIngresosDt = void 0;
const handleError_1 = require("../utils/handleError");
const ingresoDtModel_1 = require("../models/ingresoDtModel");
const entidad = 'INGRESO_DT';
const getIngresosDt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ingresosDt = yield ingresoDtModel_1.IngresoDt.findAll({ where: { estado: true } });
        res.status(200).json({ value: ingresosDt });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getIngresosDt = getIngresosDt;
