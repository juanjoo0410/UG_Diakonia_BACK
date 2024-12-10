import { Request, Response } from "express";
import { Usuario } from "../models/usuarioModel";
import { handleHttp } from "../utils/handleError";
import { compare, encrypt } from '../helpers/handleBcrypt';
import { generateToken } from "../helpers/handleJwt";
import { Rol } from "../models/rolModel";

const login = async (req: Request, res: Response) => {
    try {
        const { codigo, clave } = req.body;
        const checkIs = await Usuario.findOne({
            where: { codigo },
            attributes: ['codigo', 'clave', 'cambiarClave', 'nombre', 'anulado'],
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['idRol', 'nombre']
            }
            ]
        });
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Usuario no encontrado'
        });
        else {
            if (checkIs.anulado) {
                res.status(403).json({
                    status: false,
                    message: 'El usuario está anulado y no puede iniciar sesión'
                });
                return;
            }
            const passHash = checkIs.clave;
            const isCorrect = await compare(clave, passHash);
            if (isCorrect) {
                let token = '';
                if (!checkIs.cambiarClave) { token = generateToken(checkIs.codigo); }
                res.status(200).json({
                    status: true,
                    token,
                    value: {
                        codigo: checkIs.codigo,
                        nombre: checkIs.nombre,
                        cambiarClave: checkIs.cambiarClave,
                        idRol: checkIs.rol?.idRol,
                        nombreRol: checkIs.rol?.nombre
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

const changePassword = async (req: Request, res: Response) => {
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
            }
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_CHANGE_PASSWORD', error);
    }
};

export {
    login, changePassword
};