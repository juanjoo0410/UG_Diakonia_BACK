import { IBaseDocument } from "./base-document.interface";
import { IEgresoTesoreriaRubro } from "./egreso-tesoreria-rubro.interface";

export interface IEgresoTesoreria extends IBaseDocument {
    cajaBancoId: number;
    acreedorId?: number;
    divisaId: number;
    valor: number;
    cajaCierreId?: number;
    rubros?: IEgresoTesoreriaRubro[];
}