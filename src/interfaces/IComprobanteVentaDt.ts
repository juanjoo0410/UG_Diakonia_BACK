import { IBodega } from "./IBodega";
import { IComprobanteVenta } from "./IComprobanteVenta";
import { IProducto } from "./IProducto";
import { IUbicacion } from "./IUbicacion";

export interface IComprobanteVentaDt{
    idComprobanteVentaDt?: number;
    idComprobanteVenta: number;
    idProducto: number;
    idBodega: number;
    idUbicacion: number;
    cantidad: number;
    precioUnd: number;
    subtotal: number;
    descuento: number;
    total: number;
    peso: number;
    estado?: boolean;
    comprobanteVenta?: IComprobanteVenta;
    producto?: IProducto;
    bodega?: IBodega;
    ubicacion?:IUbicacion;
}