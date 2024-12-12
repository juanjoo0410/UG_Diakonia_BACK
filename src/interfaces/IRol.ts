import { RolSubmenu } from "../models/rolSubmenuModel";

export interface IRol {
    idRol?: number;
    nombre: string;
    anulado?: boolean;
    roles_submenus?: RolSubmenu[];
  }
  