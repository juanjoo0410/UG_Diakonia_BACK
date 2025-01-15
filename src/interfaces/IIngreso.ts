import { IngresoDt } from "../models/ingresoDtModel";
import { TipoTransaccion } from "../models/tipoTransaccionModel";

export interface IIngreso{
    idIngreso?: number;
    idTipoTransaccion: number;
    descripcion: string;
    idDonante?: number;
    totalPeso: number;
    estado?: boolean;
    fecha?: Date;
    ingresoDt?: IngresoDt[];
    tipoTransaccion?: TipoTransaccion;
}