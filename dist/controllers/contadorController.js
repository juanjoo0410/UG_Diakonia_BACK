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
exports.getContadores = exports.createContador = void 0;
const handleError_1 = require("../utils/handleError");
const contadorModel_1 = require("../models/contadorModel");
const createContador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contador = req.body;
        const checkIs = yield contadorModel_1.Contador.findOne({ where: { nombre: contador.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre del contador ya existe'
            });
        }
        else {
            const newContador = yield contadorModel_1.Contador.create(contador);
            res.status(201).json({
                status: true,
                message: 'Contador agregado exitosamente.',
                value: newContador
            });
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createContador = createContador;
const getContadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contadores = yield contadorModel_1.Contador.findAll({ where: { estado: true } });
        res.status(200).json({ value: contadores });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getContadores = getContadores;
