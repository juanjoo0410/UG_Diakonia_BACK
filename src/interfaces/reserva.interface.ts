export interface IReserva{
    id?: number;
    productoId: number;
    bodegaId: number;
    ubicacionId:number;
    reserva: number;
    pesoTotal: number;
    anulado?: boolean;
}