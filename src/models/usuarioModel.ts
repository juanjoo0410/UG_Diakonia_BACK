import db from "../config/db";
import {IUsuario } from "../interfaces/IUsuario";

const createUsuario = (user: IUsuario) => {
    const query = "INSERT INTO users (nombre, codigo, clave, creado_por) VALUES (?, ?, ?, ?)";
    return new Promise<any>((resolve, reject) => {
        db.query(query, [
            user.nombre, 
            user.codigo,
            user.clave,
            user.creado_por], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

export default {
    createUsuario,
};