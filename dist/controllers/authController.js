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
exports.forgotPassword = exports.changePassword = exports.login = void 0;
const usuarioModel_1 = require("../models/usuarioModel");
const handleError_1 = require("../utils/handleError");
const handleBcrypt_1 = require("../helpers/handleBcrypt");
const handleJwt_1 = require("../helpers/handleJwt");
const rolModel_1 = require("../models/rolModel");
const rolSubmenuModel_1 = require("../models/rolSubmenuModel");
const submenuModel_1 = require("../models/submenuModel");
const bitacoraService_1 = require("../utils/bitacoraService");
const sendEmail_1 = require("../utils/sendEmail");
const entidad = 'AUTENTICACION';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { codigo, clave } = req.body;
        const checkIs = yield usuarioModel_1.Usuario.findOne({
            where: { codigo },
            attributes: ['idUsuario', 'codigo', 'clave', 'cambiarClave', 'nombre', 'anulado'],
            include: [{
                    model: rolModel_1.Rol,
                    as: 'rol',
                    attributes: ['idRol', 'nombre'],
                    include: [{
                            model: rolSubmenuModel_1.RolSubmenu,
                            as: 'roles_submenus', // Alias definido en la relación
                            attributes: ['idSubmenu'],
                            include: [{
                                    model: submenuModel_1.Submenu,
                                    as: 'submenu',
                                    attributes: ['idSubmenu'], // Asegúrate de incluir esta relación
                                }],
                        }]
                }]
        });
        if (!checkIs)
            res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        else {
            if (checkIs.anulado) {
                res.status(403).json({
                    status: false,
                    message: 'El usuario no esta activo y no puede iniciar sesión'
                });
                return;
            }
            const passHash = checkIs.clave;
            const isCorrect = yield (0, handleBcrypt_1.compare)(clave, passHash);
            if (isCorrect) {
                let token = '';
                if (!checkIs.cambiarClave) {
                    token = (0, handleJwt_1.generateToken)((_a = checkIs.idUsuario) !== null && _a !== void 0 ? _a : 0, checkIs.codigo);
                }
                const permisos = ((_c = (_b = checkIs.rol) === null || _b === void 0 ? void 0 : _b.roles_submenus) === null || _c === void 0 ? void 0 : _c.map((permiso) => permiso.idSubmenu)) || [];
                req.user = { idUsuario: (_d = checkIs.idUsuario) !== null && _d !== void 0 ? _d : 0 };
                yield (0, bitacoraService_1.registrarBitacora)(req, 'INICIO DE SESION', entidad, `El usuario ${checkIs.nombre} inició sesión.`);
                res.status(200).json({
                    status: true,
                    token,
                    value: {
                        codigo: checkIs.codigo,
                        nombre: checkIs.nombre,
                        cambiarClave: checkIs.cambiarClave,
                        idRol: (_e = checkIs.rol) === null || _e === void 0 ? void 0 : _e.idRol,
                        nombreRol: (_f = checkIs.rol) === null || _f === void 0 ? void 0 : _f.nombre,
                        permisos
                    }
                });
            }
            else
                res.status(401).json({
                    status: false,
                    message: 'Contraseña no es correcta'
                });
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_GET', error);
    }
});
exports.login = login;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { codigo, oldPassword, newPassword } = req.body;
        const user = yield usuarioModel_1.Usuario.findOne({ where: { codigo } });
        if (!user)
            res.status(404).json({
                status: false,
                message: 'Usuario no encontrado'
            });
        else {
            const isCorrect = yield (0, handleBcrypt_1.compare)(oldPassword, user.clave);
            if (!isCorrect) {
                res.status(401).json({
                    status: false,
                    message: 'La contraseña actual es incorrecta'
                });
            }
            else {
                const passHash = yield (0, handleBcrypt_1.encrypt)(newPassword);
                user.clave = passHash;
                user.cambiarClave = false;
                yield user.save();
                res.status(200).json({
                    status: true,
                    message: 'Contraseña actualizada exitosamente'
                });
                req.user = { idUsuario: (_a = user.idUsuario) !== null && _a !== void 0 ? _a : 0 };
                yield (0, bitacoraService_1.registrarBitacora)(req, 'CAMBIAR CLAVE', entidad, `El usuario ${user.nombre} realizó cambio de clave de acceso.`);
            }
        }
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_CHANGE_PASSWORD', error);
    }
});
exports.changePassword = changePassword;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { codigo, newPassword } = req.body;
    try {
        const user = yield usuarioModel_1.Usuario.findOne({ where: { codigo } });
        if (!user) {
            res.status(404).json({
                status: false,
                message: 'Usuario no encontrado.'
            });
            return;
        }
        ;
        if (user.anulado) {
            res.status(404).json({
                status: false,
                message: 'El usuario ingresado no esta activo.'
            });
            return;
        }
        ;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(user.correo)) {
            res.status(404).json({
                status: false,
                message: `La cuenta de correo registrada no es válida: ${user.correo}`
            });
            return;
        }
        const passHash = yield (0, handleBcrypt_1.encrypt)(newPassword);
        user.clave = passHash;
        user.cambiarClave = true;
        yield user.save();
        res.status(200).json({
            status: true,
            message: 'Recuperación exitosa. Se envió al correo registrado la contraseña temporal.'
        });
        const form = {
            nombre: 'Webmaster',
            email: 'jecheverria@alessa.com.ec',
            asunto: 'Sistema Diakonia: Recuperación de contraseña',
            mensaje: `<p>Estimado(a) <strong>${user.nombre}</strong>, se ha recibido una solicitud para restablecer su contraseña. A continuación, encontrará su nueva contraseña temporal:</p>
                    <ul>
                    <li><strong>Contraseña temporal:</strong> ${newPassword}</li>
                    </ul>
                    <p>Por motivos de seguridad, el sistema le solicitará cambiar esta contraseña al iniciar sesión.</p>
                    <p>Si usted no solicitó este cambio, por favor comuníquese con el Administrador del Sistema.</p>
                    <p><strong>Webmaster</strong></p>`
        };
        yield (0, sendEmail_1.sendNotify)(form);
        req.user = { idUsuario: (_a = user.idUsuario) !== null && _a !== void 0 ? _a : 0 };
        yield (0, bitacoraService_1.registrarBitacora)(req, 'RECUPERACION CLAVE', entidad, `El usuario ${user.nombre} solicitó recuperacion de clave de acceso.`);
    }
    catch (error) {
        return (0, handleError_1.handleHttp)(res, 'ERROR_CHANGE_PASSWORD', error);
    }
});
exports.forgotPassword = forgotPassword;
