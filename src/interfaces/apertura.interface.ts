export interface IApertura {
    id?: number;
    fecha: Date;
    cajaId: number;
    encargadoId: number;
    fondoFijo: number;
    cerrada: boolean;
    cerradaPorId?: number;
    cerradaFecha?: number;
    ingresoTesoreriaId?: number;
    faltante: number;
    sobrante: number;
    creadorId: number;
}