import { Request, Response } from "express";
import { Usuario } from "../models/usuarioModel";
import { handleHttp } from "../utils/error.handle";
import { compare } from '../helpers/handleBcrypt';
import { generateToken } from "../helpers/handleJwt";

const login = async (req: Request, res: Response) => {
    try {
        const { codigo, clave } = req.body;
        const checkIs = await Usuario.findOne( { where: { codigo }});
        if (!checkIs) res.status(404).json({ message: 'Usuario no encontrado' });
        else {
            const passHash = checkIs.clave;
            const isCorrect = await compare(clave, passHash);
            if (isCorrect){
                const token = generateToken(checkIs.codigo);
                res.status(200).json({token, user: checkIs});
            }
            else res.status(403).json({ message: 'Contraseña no es correcta'});
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_GET', error);
    }
}

export {
    login
};