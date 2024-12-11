import { Menu } from "../models/menuModel";

export interface ISubmenu {
    idSubmenu?: number;
    idMenu: number;
    nombre: string;
    ruta: string;
    orden: number;
    anulado?: boolean;
    menu?: Menu;
}