import { IBaseDocument } from "./base-document.interface";
import { IDepositoDt } from "./deposito-dt.interface";

export interface IDeposito extends IBaseDocument {
    cajaBancoId: number;
    cajaId: number;    
    divisaId: number;
    total: number;
    fechaPapeleta: Date;
    numeroPapeleta: string;
    rutaPapeleta: string;
    detalles?: IDepositoDt[];
}