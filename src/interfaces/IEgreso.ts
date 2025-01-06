import { EgresoDt } from "../models/egresoDtModel";
import { TipoDocumento } from "../models/tipoDocumentoModel";

export interface IEgreso{
    idEgreso?: number;
    idTipoDocumento: number;
    descripcion: string;
    idBeneficiario: number
    totalPeso: number;
    estado?: boolean;
    egresoDt?: EgresoDt[];
    tipoDocumento?: TipoDocumento;
}