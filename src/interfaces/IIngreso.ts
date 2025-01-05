import { IngresoDt } from "../models/ingresoDtModel";
import { TipoDocumento } from "../models/tipoDocumentoModel";

export interface IIngreso{
    idIngreso?: number;
    idTipoDocumento: number;
    descripcion: string;
    totalPeso: number;
    estado?: boolean;
    ingresoDt?: IngresoDt[];
    tipoDocumento?: TipoDocumento;
}