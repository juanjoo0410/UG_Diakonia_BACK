import { IAuth } from "./IAuth";

export interface IUsuario extends IAuth {
    idUsuario?: number;
    nombre: string;
    correo: string;
    cambiarClave?: boolean;
    idRol: number;
    anulado?: boolean;
}