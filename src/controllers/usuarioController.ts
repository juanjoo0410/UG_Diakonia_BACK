import { Request, Response } from 'express';
import { Usuario } from '../models/usuarioModel';
import { handleHttp } from '../utils/error.handle';
import { encrypt } from '../helpers/handleBcrypt';

// Crear un nuevo rol
const createUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, codigo, clave, idRol } = req.body;
        const checkIs = await Usuario.findOne({ where: { codigo } });
        if (checkIs) {
            res.status(400).json({ message: 'Usuario ya existe' });
        } else {
            const passHash = await encrypt(clave);
            const newUsuario = await Usuario.create({ nombre, codigo, clave: passHash, idRol });
            res.status(201).json({
                message: 'Usuario agregado',
                data: newUsuario
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

export {createUsuario};