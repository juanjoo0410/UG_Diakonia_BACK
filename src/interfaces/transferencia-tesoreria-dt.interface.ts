export interface ITransferenciaTesoreriaDt {
    id?: number;
    transferenciaTesoreriaId: number;
    documentoId: number;
    tipo: string;
    divisaId: number;
    cambio: number;
    valor: number;
}