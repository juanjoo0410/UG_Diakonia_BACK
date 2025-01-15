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
exports.generarCodigo = generarCodigo;
const contadorModel_1 = require("../models/contadorModel");
function generarCodigo(nombre, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const contador = yield contadorModel_1.Contador.findOne({
            where: { nombre },
            transaction,
        });
        if (!contador) {
            throw new Error(`Contador con nombre "${nombre}" no encontrado.`);
        }
        contador.ultimoValor += 1;
        yield contador.save({ transaction });
        const nuevoCodigo = `${contador.prefijo}${contador.ultimoValor.toString().padStart(contador.numFormato, '0')}`;
        return nuevoCodigo;
    });
}
