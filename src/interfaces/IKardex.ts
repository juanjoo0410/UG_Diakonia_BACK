import { IBodega } from "./IBodega";
import { IProducto } from "./IProducto";
import { IUbicacion } from "./IUbicacion";

export interface IKardex{
    idKardex?: number;
    idDocumento: number;
    tipo: string;
    detalle: string;
    idBodega: number;
    idUbicacion: number;
    idProducto: number;
    cantidad: number;
    esIngreso: boolean;
    unidades: number;
    bodega?: IBodega;
    ubicacion?: IUbicacion;
    producto?: IProducto;
}