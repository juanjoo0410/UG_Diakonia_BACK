import { IBodega } from "./IBodega";
import { IEgreso } from "./IEgreso";
import { IProducto } from "./IProducto";
import { IUbicacion } from "./IUbicacion";

export interface IEgresoDt{
    idEgresoDt?: number;
    idEgreso: number;
    idProducto: number;
    idBodega: number;
    idUbicacion: number;
    cantidad: number;
    peso: number;
    estado?: boolean;
    egreso?: IEgreso;
    producto?: IProducto;
    bodega?: IBodega;
    ubicacion?: IUbicacion;
}