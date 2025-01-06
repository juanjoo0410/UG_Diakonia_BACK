import { IBodega } from "./IBodega";
import { IProducto } from "./IProducto";

export interface IKardex{
    idKardex?: number;
    idDocumento: number;
    tipo: string;
    detalle: string;
    idBodega: number;
    idProducto: number;
    cantidad: number;
    esIngreso: boolean;
    unidades: number;
    bodega?: IBodega;
    producto?: IProducto;
}