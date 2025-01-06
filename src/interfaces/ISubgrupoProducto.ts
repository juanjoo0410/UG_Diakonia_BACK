import { IGrupoProducto } from "./IGrupoProducto";

export interface ISubgrupoProducto {
    idSubgrupoProducto?: number;
    codigo: string;
    nombre: string;
    idGrupoProducto: number;
    estado?: boolean;
    grupoProducto?: IGrupoProducto;
}