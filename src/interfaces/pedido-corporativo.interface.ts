import { IBaseDocument } from "./base-document.interface";

export interface IPedidoCorporativo extends IBaseDocument{
    empresaPatrocinadoraId: number;
    tipoPago: string;
    banco: string;
    subtotal: number;
    descuento: number;
    valorCupon: number;
    total: number;
    totalPeso: number;
    usuario: string;
    bancoTransferenciaId?: number;
}