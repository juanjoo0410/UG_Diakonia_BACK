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
exports.getEmpresa = exports.updateEmpresa = exports.createEmpresa = void 0;
const empresaModel_1 = require("../models/empresaModel");
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const entidad = 'EMPRESA';
const getEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresa = yield empresaModel_1.Empresa.findOne({ where: { estado: true } });
        if (!empresa)
            res.status(404).json({
                status: false,
                message: 'Empresa no encontrada'
            });
        else
            res.status(200).json({
                status: true,
                value: empresa
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getEmpresa = getEmpresa;
const createEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresa = req.body;
        const checkIs = yield empresaModel_1.Empresa.findOne({ where: { ruc: empresa.ruc } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'Ruc de empresa ya existe'
            });
        }
        else {
            yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creo la empresa ${empresa.razonSocial}.`);
            const newEmpresa = yield empresaModel_1.Empresa.create(empresa);
            res.status(201).json({
                status: true,
                message: 'Empresa registrada exitosamente.',
                value: newEmpresa
            });
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createEmpresa = createEmpresa;
const updateEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresa = req.body;
        const checkIs = yield empresaModel_1.Empresa.findByPk(empresa.idEmpresa);
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Empresa no encontrada'
            });
        else {
            checkIs.ruc = empresa.ruc;
            checkIs.razonSocial = empresa.razonSocial;
            checkIs.representanteLegal = empresa.representanteLegal;
            checkIs.direccion = empresa.direccion;
            checkIs.telefono = empresa.telefono;
            checkIs.rutaLogo = empresa.rutaLogo;
            checkIs.obligadoContabilidad = empresa.obligadoContabilidad;
            yield checkIs.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la empresa ${empresa.razonSocial}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de empresa actualizados exitosamente.',
                value: checkIs
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateEmpresa = updateEmpresa;
