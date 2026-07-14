export interface IIngresoTesoreriaDt {
    id?: number;
    ingresoTesoreriaId: number;
    tipoValor: string;
    divisaId: number;
    cambio: number;    
    valor: number;
}