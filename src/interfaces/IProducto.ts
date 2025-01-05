import { Categoria } from "../models/categoriaModel";
import { Donante } from "../models/donanteModel";
import { GrupoProducto } from "../models/grupoProductoModel";
import { SubgrupoProducto } from "../models/subgrupoProductoModel";

export interface IProducto{
    idProducto?: number;
    codigo: string;
    descripcion: string;
    idGrupoProducto: number;
    idSubgrupoProducto: number;
    idCategoria: number;
    idDonante: number;
    prest: string;
    unidadesPorPrest: number;
    pesoPorUnidad: number;
    unidadPeso: string;
    lote: string;
    fechaCaducidad: Date;
    precioCosto: number;
    precioTiendita: number;
    sku: string;
    estado?: boolean;
    tipoOrg?: GrupoProducto;
    tipoPoblacion?: SubgrupoProducto;
    categoria?: Categoria;
    donante?: Donante;
}