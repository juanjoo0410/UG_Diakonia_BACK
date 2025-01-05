import { IComprobanteVenta } from "./IComprobanteVenta";
import { IProducto } from "./IProducto";

export interface IComprobanteVentaDt{
    idComprobanteVentaDt?: number;
    idComprobanteVenta: number;
    idProducto: number;
    cantidad: number;
    precioUnd: number;
    total: number;
    estado?: boolean;
    comprobanteVenta?: IComprobanteVenta;
    producto?: IProducto;
}