import { EgresoDt } from "../models/egresoDtModel";
import { TipoTransaccion } from "../models/tipoTransaccionModel";

export interface IEgreso{
    idEgreso?: number;
    idTipoTransaccion: number;
    descripcion: string;
    idBeneficiario: number
    totalPeso: number;
    estado?: boolean;
    egresoDt?: EgresoDt[];
    tipoTransaccion?: TipoTransaccion;
}