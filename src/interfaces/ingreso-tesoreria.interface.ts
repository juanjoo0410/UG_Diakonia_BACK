import { IBaseDocument } from "./base-document.interface";
import { IIngresoTesoreriaDenominacion } from "./ingreso-tesoreria-denominacion.interface";
import { IIngresoTesoreriaDocumento } from "./ingreso-tesoreria-documentos.interface";
import { IIngresoTesoreriaDt } from "./ingreso-tesoreria-dt.interface";

export interface IIngresoTesoreria extends IBaseDocument {
    cajaBancoId: number;
    cajaBancoCierreId?: number;
    divisaId: number;
    valor: number;
    detalles?: IIngresoTesoreriaDt[];
    documentos?: IIngresoTesoreriaDocumento[];
    denominaciones?: IIngresoTesoreriaDenominacion[];
}