export interface ITipoDocumento{
    idTipoDocumento?: number;
    nombre: string;
    ingreso: boolean;
    egreso: boolean;
    estado?: boolean;
}