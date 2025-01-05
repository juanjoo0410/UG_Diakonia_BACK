import { Bodega } from "../models/bodegaModel";
import { Ingreso } from "../models/ingresoModel";
import { Producto } from "../models/productoModel";
import { Ubicacion } from "../models/ubicacionModel";

export interface IIngresoDt{
    idIngresoDt?: number;
    idIngreso: number;
    idProducto: number;
    idBodega: number;
    idUbicacion: number;
    cantidad: number;
    peso: number;
    estado?: boolean;
    ingreso?: Ingreso;
    producto?: Producto;
    bodega?: Bodega;
    ubicacion?: Ubicacion;
}