import { IBeneficiario } from "./IBeneficiario";
import { IComprobanteVentaDt } from "./IComprobanteVentaDt";

export interface IComprobanteVenta {
    idComprobanteVenta?: number;
    idBeneficiario?: number;
    empresaPatrocinadoraId?: number;
    tipoPago: string;
    banco: string;
    subtotal: number;
    descuento: number;
    valorCupon: number;
    diferenciaEfectivo?: number;
    total: number;
    totalPeso: number;
    usuario: string;
    estado?: boolean;
    fecha?: Date;
    comprobanteVentaDt?: IComprobanteVentaDt[];
    beneficiario?: IBeneficiario;
    cajaId?: number;
    bancoTransferenciaId?: number;
    pedidoCorporativoId?: number;
}