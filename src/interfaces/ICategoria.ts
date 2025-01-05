import { GrupoProducto } from "../models/grupoProductoModel";
import { SubgrupoProducto } from "../models/subgrupoProductoModel";

export interface ICategoria {
    idCategoria?: number;
    codigo: string;
    nombre: string;
    idGrupoProducto: number;
    idSubgrupoProducto: number;
    estado?: boolean;
    grupoProducto?: GrupoProducto;
    subgrupoProducto?: SubgrupoProducto;
}