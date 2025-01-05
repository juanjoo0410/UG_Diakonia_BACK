import { ICliente } from "./ICliente";
import { IComprobanteVentaDt } from "./IComprobanteVentaDt";

export interface IComprobanteVenta{
    idComprobanteVenta?: number;
    idCliente: number;
    tipoPago: string;
    subtotal: number;
    descuento: number;
    total: number;
    estado?: boolean;
    comprobanteVentaDt?: IComprobanteVentaDt[];
    cliente?: ICliente;
}