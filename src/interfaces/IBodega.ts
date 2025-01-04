export interface IBodega{
    idBodega?: number;
    codigo: string;
    nombre: string;
    tipoProducto: string;
    responsable: string;
    venta: boolean;
    averiados: boolean;
    estado?: boolean;
}