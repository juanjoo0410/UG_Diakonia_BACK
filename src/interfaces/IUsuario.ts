import { IAuth } from "./IAuth";

export interface IUsuario extends IAuth {
    idUsuario?: number;
    nombre: string;
    idRol: number;
    anulado?: boolean;
}