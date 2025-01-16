import { ICliente } from "./ICliente";
import { IComprobanteVentaDt } from "./IComprobanteVentaDt";

export interface IComprobanteVenta{
    idComprobanteVenta?: number;
    idCliente: number;
    tipoPago: string;
    banco: string;
    subtotal: number;
    descuento: number;
    valorCupon: number;
    total: number;
    usuario: string;
    estado?: boolean;
    fecha?: Date;
    comprobanteVentaDt?: IComprobanteVentaDt[];
    cliente?: ICliente;
}