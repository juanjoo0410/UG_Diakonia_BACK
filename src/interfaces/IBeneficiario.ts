import { IClasificacion } from "./IClasificacion";
import { ITipoOrg } from "./ITipoOrg";
import { ITipoPoblacion } from "./ITipoPoblacion";

export interface IBeneficiario{
    idBeneficiario?: number;
    codigo: string;
    identificacion: string;
    nombre: string;
    tipoBeneficiario: string;
    idTipoOrg: number;
    idTipoPoblacion: number;
    idClasificacion: number;
    actividad: string;
    totalBeneficiarios: number;
    direccion: string;
    telefono: string;
    correo: string;
    nombreContacto: string;
    estado?: boolean;
    tipoOrg?: ITipoOrg;
    tipoPoblacion?: ITipoPoblacion;
    clasificacion?: IClasificacion;
}