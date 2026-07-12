export interface IBaseDocument {
    id?: number;
    fecha: Date;
    descripcion: string;
    nota: string;
    anulado?: boolean;
}