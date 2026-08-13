import { IBaseDocument } from "./base-document.interface";

export interface ITransferenciaBancaria extends IBaseDocument {
    cajaBancoOrigenId: number;
    cajaBancoDestinoId: number;
    divisaId: number;
    valor: number;
}