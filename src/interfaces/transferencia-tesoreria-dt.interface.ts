export interface ITransferenciaTesoreriaDt {
    id: number;
    transferenciaTesoreriaId: number;
    documentoId: string;
    tipo: string;
    divisaId: number;
    cambio: number;
    valor: number;
}