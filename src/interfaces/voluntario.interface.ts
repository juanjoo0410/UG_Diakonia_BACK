import { ITipoJornada } from "./tipo-jornada.interface";

export interface IVoluntario{
    idVoluntario?: number;
    codigo: string;
    identificacion: string;
    nombre: string;
    sexo: string;
    idTipoJornada: number;
    tipoJornada?: ITipoJornada;
    recibeKit: boolean;
    estado?: boolean;
}