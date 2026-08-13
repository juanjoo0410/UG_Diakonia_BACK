export interface IApertura {
    id?: number;
    fecha: Date;
    cajaId: number;
    encargadoId: number;
    fondoFijo: number;
    cerrada: boolean;
    cerradaPorId?: number;
    cerradaFecha?: Date;
    ingresoTesoreriaId?: number;
    faltante: number;
    sobrante: number;
    creadorId: number;
}