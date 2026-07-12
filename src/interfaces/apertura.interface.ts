export interface IApertura {
    id?: number;
    cajaId: number;
    encargadoId: number;
    fondoFijo: number;
    cerrada: boolean;
    cerradaPor?: number;
    cerradaFecha?: number;
    ingresoTesoreriaId?: number;
    faltante: number;
    sobrante: number;
}