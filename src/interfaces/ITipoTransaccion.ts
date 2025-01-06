export interface ITipoTransaccion{
    idTipoTransaccion?: number;
    nombre: string;
    ingreso: boolean;
    egreso: boolean;
    estado?: boolean;
}