import { Bodega } from "../models/bodegaModel";

export interface IUbicacion {
    idUbicacion?: number;
    codigo: string;
    idBodega: number;
    capacidadMaxima: number;
    estado?: boolean;
    bodega?: Bodega;
}