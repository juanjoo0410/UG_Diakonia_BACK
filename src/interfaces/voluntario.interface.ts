import { IInstitucion } from "./IInstitucion";

export interface IVoluntario {
    idVoluntario?: number;
    codigo: string;
    esExtranjero: boolean;
    identificacion: string;
    nombre: string;
    sexo: string;
    idInstitucion?: number;
    institucion?: IInstitucion;
    familia: boolean;
    voluntarioEducativo: boolean;
    voluntarioCorporativo: boolean;
    recibeKit: boolean;
    observaciones: string;
    estado?: boolean;
}