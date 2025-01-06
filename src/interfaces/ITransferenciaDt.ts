import { IProducto } from "./IProducto";
import { ITransferencia } from "./ITransferencia";
import { IUbicacion } from "./IUbicacion";

export interface ITransferenciaDt{
    idTransferenciaDt?: number;
    idTransferencia: number;
    idProducto: number;
    idUbicacionOrigen: number;
    idUbicacionDestino: number;
    cantidad: number;
    peso: number;
    estado?: boolean;
    transferencia?: ITransferencia;
    producto?: IProducto;
    ubicacionOrigen?: IUbicacion;
    ubicacionDestino?: IUbicacion;
}