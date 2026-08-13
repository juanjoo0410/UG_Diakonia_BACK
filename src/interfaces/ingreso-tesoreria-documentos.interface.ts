export interface IIngresoTesoreriaDocumento {
    id?: number;
    ingresoTesoreriaId: number;
    documentoId: number;
    fecha: Date;
    tipo: string;
    numero: string;
    descripcion: string;
    divisaId: number;
    valor: number;
    cajeroId: number;
}