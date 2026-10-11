export interface FilterDto {
    fechaInicio: string | Date;
    fechaFin: string | Date;
    cajaBancoId: number;
    bodegaId: number;
    productoId: number;
}