import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UsuarioModel from "../models/usuarioModel";
import { IUsuario } from "../interfaces/IUsuario";
import { encrypt, compare} from "../helpers/handleBcrypt";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { nombre, codigo, clave, creado_por }: IUsuario = req.body;

        const hashedPassword = await encrypt(clave);

        // Crear el nuevo usuario con la contraseña hasheada
        const result = await UsuarioModel.createUsuario({ nombre, codigo, clave: hashedPassword, creado_por });

        res.status(201).json({
            message: "Usuario creado exitosamente",
            userId: result.insertId, // El ID del nuevo usuario
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el usuario",
            error: error,
        });
    }
};
