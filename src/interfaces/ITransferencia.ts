import { IBodega } from "./IBodega";
import { ITransferenciaDt } from "./ITransferenciaDt";

export interface ITransferencia{
    idTransferencia?: number;
    descripcion: string;
    idBodegaOrigen: number;
    idBodegaDestino: number;
    totalPeso: number;
    estado?: boolean;
    transferenciaDt?: ITransferenciaDt[];
    bodegaOrigen?: IBodega;
    bodegaDestino?: IBodega;
}