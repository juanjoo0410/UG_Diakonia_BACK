import { ICategoria } from "./ICategoria";
import { IDonante } from "./IDonante";
import { IGrupoProducto } from "./IGrupoProducto";
import { ISubgrupoProducto } from "./ISubgrupoProducto";

export interface IProducto{
    idProducto?: number;
    codigo: string;
    descripcion: string;
    idGrupoProducto: number;
    idSubgrupoProducto: number;
    idCategoria: number;
    prest: string;
    unidadesPorPrest: number;
    pesoPorUnidad: number;
    unidadPeso: string;
    lote?: string;
    fechaCaducidad?: Date;
    precioCosto: number;
    precioTiendita: number;
    sku: string;
    estado?: boolean;
    grupoProducto?: IGrupoProducto;
    subgrupoProducto?: ISubgrupoProducto;
    categoria?: ICategoria;
    donante?: IDonante;
}