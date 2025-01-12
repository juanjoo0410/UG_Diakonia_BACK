import { Request, Response } from "express";
import { Usuario } from "../models/usuarioModel";
import { handleHttp } from "../utils/handleError";
import { compare, encrypt } from '../helpers/handleBcrypt';
import { generateToken } from "../helpers/handleJwt";
import { Rol } from "../models/rolModel";
import { RolSubmenu } from "../models/rolSubmenuModel";
import { Submenu } from "../models/submenuModel";
import { registrarBitacora } from "../utils/bitacoraService";
import { sendNotify } from "../utils/sendEmail";

const entidad = 'AUTENTICACION';

const login = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { codigo, clave } = req.body;
        const checkIs = await Usuario.findOne({
            where: { codigo },
            attributes: ['idUsuario', 'codigo', 'clave', 'cambiarClave', 'nombre', 'anulado'],
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['idRol', 'nombre'],
                include: [{
                    model: RolSubmenu,
                    as: 'roles_submenus', // Alias definido en la relación
                    attributes: ['idSubmenu'],
                    include: [{
                        model: Submenu,
                        as: 'submenu',
                        attributes: ['idSubmenu'], // Asegúrate de incluir esta relación
                    }],
                }]
            }]
        });
        if (!checkIs) res.status(404).json({
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
            const isCorrect = await compare(clave, passHash);
            if (isCorrect) {
                let token = '';
                if (!checkIs.cambiarClave) { token = generateToken(checkIs.idUsuario ?? 0, checkIs.codigo); }
                const permisos = checkIs.rol?.roles_submenus?.map((permiso: any) => permiso.idSubmenu) || [];
                req.user = { idUsuario: checkIs.idUsuario ?? 0 };
                await registrarBitacora(req, 'INICIO DE SESION', entidad, `El usuario ${checkIs.nombre} inició sesión.`)

                res.status(200).json({
                    status: true,
                    token,
                    value: {
                        codigo: checkIs.codigo,
                        nombre: checkIs.nombre,
                        cambiarClave: checkIs.cambiarClave,
                        idRol: checkIs.rol?.idRol,
                        nombreRol: checkIs.rol?.nombre,
                        permisos
                    }
                });
            }
            else res.status(401).json({
                status: false,
                message: 'Contraseña no es correcta'
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_GET', error);
    }
}

const changePassword = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { codigo, oldPassword, newPassword } = req.body;

        const user = await Usuario.findOne({ where: { codigo } });
        if (!user) res.status(404).json({
            status: false,
            message: 'Usuario no encontrado'
        });
        else {
            const isCorrect = await compare(oldPassword, user.clave);
            if (!isCorrect) {
                res.status(401).json({
                    status: false,
                    message: 'La contraseña actual es incorrecta'
                });
            }
            else {
                const passHash = await encrypt(newPassword);
                user.clave = passHash;
                user.cambiarClave = false;
                await user.save();
                res.status(200).json({
                    status: true,
                    message: 'Contraseña actualizada exitosamente'
                });
                req.user = { idUsuario: user.idUsuario ?? 0 };
                await registrarBitacora(req, 'CAMBIAR CLAVE', entidad,
                    `El usuario ${user.nombre} realizó cambio de clave de acceso.`)
            }
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_CHANGE_PASSWORD', error);
    }
};

const forgotPassword = async (req: Request & { user?: any }, res: Response) => {
    const { codigo, newPassword } = req.body;
    try {
        const user = await Usuario.findOne({ where: { codigo } });
        if (!user) {
            res.status(404).json({
                status: false,
                message: 'Usuario no encontrado.'
            });
            return
        };
        if (user.anulado) {
            res.status(404).json({
                status: false,
                message: 'El usuario ingresado no esta activo.'
            });
            return
        };
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(user.correo)) {
            res.status(404).json({
                status: false,
                message: `La cuenta de correo registrada no es válida: ${user.correo}`
            });
            return
        }
        const passHash = await encrypt(newPassword);
        user.clave = passHash;
        user.cambiarClave = true;
        await user.save();
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
                    <p><strong>Webmaster</strong></p>`};
        await sendNotify(form);
        req.user = { idUsuario: user.idUsuario ?? 0 };
        await registrarBitacora(req, 'RECUPERACION CLAVE', entidad,
            `El usuario ${user.nombre} solicitó recuperacion de clave de acceso.`)
    } catch (error) {
        return handleHttp(res, 'ERROR_CHANGE_PASSWORD', error);
    }
};

export {
    login, changePassword, forgotPassword
};