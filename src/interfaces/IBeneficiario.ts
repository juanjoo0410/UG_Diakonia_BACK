import { TipoOrg } from "../models/tipoOrgModel";
import { TipoPoblacion } from "../models/tipoPoblacionModel";

export interface IBeneficiario{
    idBeneficiario?: number;
    codigo: string;
    identificacion: string;
    nombre: string;
    tipoBeneficiario: string;
    idTipoOrg: number;
    idTipoPoblacion: number;
    actividad: string;
    totalBeneficiarios: number;
    direccion: string;
    telefono: string;
    correo: string;
    nombreContacto: string;
    estado?: boolean;
    tipoOrg?: TipoOrg;
    tipoPoblacion?: TipoPoblacion;
}