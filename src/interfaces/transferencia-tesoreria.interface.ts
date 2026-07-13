import { IBaseDocument } from "./base-document.interface";
import { ITransferenciaTesoreriaDt } from "./transferencia-tesoreria-dt.interface";

export interface ITransferenciaTesoreria extends IBaseDocument {
    cajaId: number;
    cajaBancoId: number;
    divisaId: number;
    cambio: number;
    valor: number;
    transferenciaTesoreriaDt?: ITransferenciaTesoreriaDt[];
}