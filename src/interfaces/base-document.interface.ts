export interface IBaseDocument {
    id?: number;
    fecha: Date;
    tipo: string;
    descripcion: string;
    nota: string;
    anulado?: boolean;
    anuladoPorId?: number;
    anuladoFecha?: Date;
    creadorId: number;
}