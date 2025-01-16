import { EgresoDt } from "../models/egresoDtModel";
import { TipoTransaccion } from "../models/tipoTransaccionModel";

export interface IEgreso{
    idEgreso?: number;
    idTipoTransaccion: number;
    descripcion: string;
    idBeneficiario?: number
    totalPeso: number;
    usuario: string;
    estado?: boolean;
    fecha?: Date;
    egresoDt?: EgresoDt[];
    tipoTransaccion?: TipoTransaccion;
}