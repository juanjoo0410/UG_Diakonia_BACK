import { GrupoProducto } from "../models/grupoProductoModel";

export interface ISubgrupoProducto {
    idSubgrupoProducto?: number;
    codigo: string;
    nombre: string;
    idGrupoProducto: number;
    estado?: boolean;
    grupoProducto?: GrupoProducto;
}