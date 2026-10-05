import { IBaseDocument } from "./base-document.interface";
import { IPedidoCorporativoBeneficiario } from "./pedido-corporativo-beneficiario.interface";
import { IPedidoCorporativoDt } from "./pedido-corporativo-dt.interface";

export interface IPedidoCorporativo extends IBaseDocument{
    empresaPatrocinadoraId: number;
    tipoPago: string;
    banco: string;
    subtotal: number;
    descuento: number;
    valorCupon: number;
    diferenciaEfectivo?: number;
    total: number;
    totalPeso: number;
    usuario: string;
    cajaId?: number;
    bancoTransferenciaId?: number;
    detalles?: IPedidoCorporativoDt[];
    beneficiarios?: IPedidoCorporativoBeneficiario[];
}