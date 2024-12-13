import { IUsuario } from "./IUsuario";

export interface IBitacora {
    idBitacora?: number;
    idUsuario: number;
    accion: string;
    entidad: string;
    descripcion: string;
    ip: string;
    navegador: string;
    fecha?: Date;
    usuario?: IUsuario
}