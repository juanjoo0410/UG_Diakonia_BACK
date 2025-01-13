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
exports.deleteUsuario = exports.updateUsuario = exports.getUsuarioById = exports.getUsuarios = exports.createUsuario = void 0;
const usuarioModel_1 = require("../models/usuarioModel");
const handleError_1 = require("../utils/handleError");
const handleBcrypt_1 = require("../helpers/handleBcrypt");
const rolModel_1 = require("../models/rolModel");
const bitacoraService_1 = require("../utils/bitacoraService");
const sendEmail_1 = require("../utils/sendEmail");
const entidad = 'USUARIO';
const createUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, codigo, clave, correo, idRol } = req.body;
        const checkIs = yield usuarioModel_1.Usuario.findOne({ where: { codigo } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'Usuario ya existe'
            });
        }
        else {
            const passHash = yield (0, handleBcrypt_1.encrypt)(clave);
            const newUsuario = yield usuarioModel_1.Usuario.create({ nombre, codigo, clave: passHash, correo, idRol });
            res.status(201).json({
                status: true,
                message: 'Usuario agregado exitosamente. Se envió al correo del usuario las credenciales ',
                data: newUsuario
            });
            const form = {
                nombre: 'Webmaster',
                email: 'jecheverria@alessa.com.ec',
                asunto: 'Sistema Diakonia: Registro de usuario exitoso',
                mensaje: `<p>Estimado(a) <strong>${newUsuario.nombre}</strong>, su cuenta ha sido creada con éxito.</p>
                        <p>A continuación, encontrará sus credenciales de acceso:</p>
                        <ul>
                        <li><strong>Usuario:</strong> ${newUsuario.codigo}</li>
                        <li><strong>Contraseña temporal:</strong> ${clave}</li>
                        </ul>
                        <p>Por motivos de seguridad, el sistema le solicitará cambiar su contraseña al iniciar sesión por primera vez.</p>
                        <p<strong>Webmaster</strong></p>`
            };
            yield (0, sendEmail_1.sendNotify)(form);
            yield (0, bitacoraService_1.registrarBitacora)(req, 'CREACIÓN', entidad, `Se creó el usuario ${newUsuario.nombre}.`);
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_POST', error);
    }
});
exports.createUsuario = createUsuario;
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield usuarioModel_1.Usuario.findAll({
            where: { anulado: false },
            include: [{
                    model: rolModel_1.Rol,
                    as: 'rol',
                    attributes: ['nombre']
                }]
        });
        res.status(200).json({ value: usuarios });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_ALL', error);
    }
});
exports.getUsuarios = getUsuarios;
const getUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield usuarioModel_1.Usuario.findByPk(id);
        if (!usuario)
            res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        else
            res.status(200).json({
                status: true,
                value: usuario
            });
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_GET_BY_ID', error);
    }
});
exports.getUsuarioById = getUsuarioById;
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idUsuario, nombre, correo, idRol } = req.body;
    try {
        const usuario = yield usuarioModel_1.Usuario.findByPk(idUsuario);
        if (!usuario)
            res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        else {
            usuario.nombre = nombre;
            usuario.correo = correo;
            usuario.idRol = idRol;
            yield usuario.save();
            res.status(200).json({
                status: true,
                message: 'Datos de usuario actualizados exitosamente',
                value: usuario
            });
            yield (0, bitacoraService_1.registrarBitacora)(req, 'MODIFICACIÓN', entidad, `Se modificó informacion del usuario ${usuario.nombre}.`);
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_PUT', error);
    }
});
exports.updateUsuario = updateUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const usuario = yield usuarioModel_1.Usuario.findByPk(id);
        if (!usuario)
            res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        else {
            usuario.anulado = true; // Marcar como anulado
            yield usuario.save();
            res.status(200).json({
                status: true,
                message: 'Usuario eliminado correctamente'
            });
            yield (0, bitacoraService_1.registrarBitacora)(req, 'ELIMINACIÓN', entidad, `Se eliminó el usuario ${usuario.nombre}.`);
        }
    }
    catch (error) {
        (0, handleError_1.handleHttp)(res, 'ERROR_DELETE', error);
    }
});
exports.deleteUsuario = deleteUsuario;
