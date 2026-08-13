export interface IIngresoTesoreriaDt {
    id?: number;
    ingresoTesoreriaId: number;
    tipoValor: string;
    divisaId: number;   
    valor: number;
    depositado: number;
    bancoId?: number;
}