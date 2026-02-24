import { IRol } from "./IRol";
import { IPermiso } from "./permiso.interface";

export interface IRolPermiso {
    idRolPermiso?: number;
    idRol: number;
    idPermiso: number;
    rol?: IRol;
    permiso?: IPermiso;
}