export interface IContador{
    idContador?: number;
    nombre: string;
    prefijo: string;
    numFormato: number;
    ultimoValor: number;
    estado?: boolean;
}