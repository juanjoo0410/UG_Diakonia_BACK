import { Rol } from "../models/rolModel";
import { Submenu } from "../models/submenuModel";

export interface IRolSubmenu {
    idRolSubmenu?: number;
    idRol: number;
    idSubmenu: number;
    rol?: Rol;
    submenu?: Submenu;
}