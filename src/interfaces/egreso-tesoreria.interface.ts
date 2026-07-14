import { IBaseDocument } from "./base-document.interface";
import { IEgresoTesoreriaRubro } from "./egreso-tesoreria-rubro.interface";

export interface IEgresoTesoreria extends IBaseDocument {
    beneficiarioCedula?: string;
    beneficiarioNombre?: string;
    cajaBancoId: number;
    divisaId: number;
    cambio: number;
    valor: number;
    cajaCierreId?: number;
    egresoTesoreriaRubros?: IEgresoTesoreriaRubro[];
}