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
exports.registrarBitacora = exports.obtenerNavegador = exports.obtenerIP = void 0;
const bitacoraModel_1 = require("../models/bitacoraModel");
const obtenerIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress || 'IP desconocida';
};
exports.obtenerIP = obtenerIP;
const obtenerNavegador = (req) => {
    return req.headers['user-agent'] || 'Navegador desconocido';
};
exports.obtenerNavegador = obtenerNavegador;
const registrarBitacora = (req, accion, entidad, descripcion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUsuario } = req.user;
        const ip = (0, exports.obtenerIP)(req);
        const navegador = (0, exports.obtenerNavegador)(req);
        yield bitacoraModel_1.Bitacora.create({ idUsuario, accion, entidad, descripcion, ip, navegador });
    }
    catch (error) {
        console.error('Error al registrar en la bitácora:', error);
    }
});
exports.registrarBitacora = registrarBitacora;
