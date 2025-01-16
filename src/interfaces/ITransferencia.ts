import { IBodega } from "./IBodega";
import { ITransferenciaDt } from "./ITransferenciaDt";

export interface ITransferencia{
    idTransferencia?: number;
    descripcion: string;
    totalPeso: number;
    usuario: string;
    estado?: boolean;
    fecha?: Date;
    transferenciaDt?: ITransferenciaDt[];
    bodegaOrigen?: IBodega;
    bodegaDestino?: IBodega;
}