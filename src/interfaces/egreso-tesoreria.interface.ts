import { IBaseDocument } from "./base-document.interface";
import { IEgresoTesoreriaRubro } from "./egreso-tesoreria-rubro.interface";

export interface IEgresoTesoreria extends IBaseDocument {
    beneficiarioId?: number;
    tipo: string;
    tipoPago: string;
    valor: number;
    cajaBancoId: number;
    cajaCierreId?: number;
    creadorId: number;
    egresoTesoreriaRubros?: IEgresoTesoreriaRubro[];
}