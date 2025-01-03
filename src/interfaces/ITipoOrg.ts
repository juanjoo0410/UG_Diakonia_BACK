import { ClaseTipoOrg } from "../models/claseTipoOrgModel";

export interface ITipoOrg {
    idTipoOrg?: number;
    codigo: string;
    nombre: string;
    idClaseTipoOrg: number;
    descripcion: string;
    estado?: boolean;
    claseTipoOrg?: ClaseTipoOrg;
}