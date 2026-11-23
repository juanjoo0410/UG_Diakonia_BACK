import { IBaseMaster } from "./base-master.interface";

export interface IBeneficiarioProyecto {
    id?: number;
    codigo: string;
    esExtranjero: boolean;
    identificacion: string;
    nombres: string;
    apellidos: string;
    sexo: string;
    fechaNacimiento: Date;
    estadoCivilId: number;
    ocupacion: string;
    autoidentificacionEtnicaId: number;
    esDiscapacitado: boolean;
    anulado?: boolean;
}