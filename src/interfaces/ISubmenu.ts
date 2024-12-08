import { IMenu } from "./IMenu";

export interface ISubmenu extends IMenu {
    idSubmenu?: number;
    idMenu: number;
    nombre: string;
    ruta: string;
    orden: number;
    anulado?: boolean;
}