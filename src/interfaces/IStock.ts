import { IBodega } from "./IBodega";
import { IProducto } from "./IProducto";
import { IUbicacion } from "./IUbicacion";

export interface IStock{
    idStock?: number;
    idProducto: number;
    idBodega: number;
    idUbicacion:number;
    stock: number;
    pesoTotal: number;
    estado?:boolean;
    producto?: IProducto;
    bodega?: IBodega;
    ubicacion?: IUbicacion;
}