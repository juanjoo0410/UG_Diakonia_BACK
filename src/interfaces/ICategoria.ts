import { IGrupoProducto } from "./IGrupoProducto";
import { ISubgrupoProducto } from "./ISubgrupoProducto";

export interface ICategoria {
    idCategoria?: number;
    codigo: string;
    nombre: string;
    idGrupoProducto: number;
    idSubgrupoProducto: number;
    estado?: boolean;
    grupoProducto?: IGrupoProducto;
    subgrupoProducto?: ISubgrupoProducto;
}