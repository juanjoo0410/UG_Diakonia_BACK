import { IngresoDt } from "../models/ingresoDtModel";
import { TipoTransaccion } from "../models/tipoTransaccionModel";

export interface IIngreso{
    idIngreso?: number;
    idTipoTransaccion: number;
    descripcion: string;
    totalPeso: number;
    estado?: boolean;
    ingresoDt?: IngresoDt[];
    tipoTransaccion?: TipoTransaccion;
}