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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.getClienteById = exports.getClientes = exports.createCliente = void 0;
const handleError_1 = require("../utils/handleError");
const bitacoraService_1 = require("../utils/bitacoraService");
const clienteModel_1 = require("../models/clienteModel");
const contadorService_1 = require("../utils/contadorService");
const db_1 = __importDefault(require("../config/db"));
const entidad = 'CLIENTE';
const createCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const cliente = req.body;
        const checkIs = yield clienteModel_1.Cliente.findOne({ where: { identificacion: cliente.identificacion } });
        if (checkIs) {
            yield transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc del cliente ya existe'
            });
        }
        else {
            cliente.codigo = yield (0, contadorService_1.generarCodigo)('clientes', transaction);
            const newCliente = yield clienteModel_1.Cliente.create(cliente);
            yield transaction.commit();
            res.status(201).json({
                status: true,
                message: `Cliente con codigo ${newCliente.codigo} agregado exitosamente.`,
                value: newCliente
            });
            yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el cliente ${cliente.nombre}.`);
        }
    }
    catch (error) {
        yield transaction.rollback();
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createCliente = createCliente;
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield clienteModel_1.Cliente.findAll({ where: { estado: true } });
        res.status(200).json({ value: clientes });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getClientes = getClientes;
const getClienteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cliente = yield clienteModel_1.Cliente.findByPk(id);
        if (!cliente)
            res.status(404).json({
                status: false,
                message: 'Cliente no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: cliente
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getClienteById = getClienteById;
const updateCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cliente = req.body;
        const checkIs = yield clienteModel_1.Cliente.findByPk(cliente.idCliente);
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Cliente no encontrado'
            });
        else {
            checkIs.codigo = cliente.codigo;
            checkIs.identificacion = cliente.identificacion;
            checkIs.nombre = cliente.nombre;
            checkIs.estadoCivil = cliente.estadoCivil;
            checkIs.sexo = cliente.sexo;
            checkIs.direccion = cliente.direccion;
            checkIs.telefono = cliente.telefono;
            checkIs.correo = cliente.correo;
            checkIs.esEmpleado = cliente.esEmpleado;
            yield checkIs.save();
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se actualizó información del cliente ${cliente.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Datos de cliente actualizados exitosamente',
                value: checkIs
            });
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateCliente = updateCliente;
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cliente = yield clienteModel_1.Cliente.findByPk(id);
        if (!cliente) {
            res.status(404).json({
                status: false,
                message: 'Cliente no encontrado. Imposible eliminar.'
            });
            return;
        }
        cliente.estado = false; // Marcar como anulado
        yield cliente.save();
        yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el cliente ${cliente.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Cliente eliminado correctamente'
        });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteCliente = deleteCliente;
