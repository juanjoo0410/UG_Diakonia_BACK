export interface IPedidoCorporativoDt{
    id?: number;
    pedidoCorporativoId: number;
    productoId: number;
    bodegaId: number;
    ubicacionId: number;
    cantidad: number;
    precioUnd: number;
    subtotal: number;
    descuento: number;
    total: number;
    peso: number;
    anulado?: boolean;
}