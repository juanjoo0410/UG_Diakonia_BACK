import { IClasificacion } from "./IClasificacion";
import { ISector } from "./ISector";
import { ITipoOrg } from "./ITipoOrg";
import { ITipoPoblacion } from "./ITipoPoblacion";

export interface IInstitucion{
    idInstitucion?: number;
    codigo: string;
    nombre: string;
    identificacion: string;
    representanteLegal: string;
    fechaIngreso: Date;
    tipo: string;
    idTipoOrg: number;
    idTipoPoblacion: number;
    idClasificacion: number;
    actividad: string;
    totalBeneficiarios: number;
    direccion: string;
    direccionUrl: string;
    latitud: number;
    longitud: number;
    idSector: number;
    nombreContacto: string;
    telefono: string;
    correo: string;    
    estado?: boolean;
    tipoOrg?: ITipoOrg;
    tipoPoblacion?: ITipoPoblacion;
    clasificacion?: IClasificacion;
    sector?: ISector;
}