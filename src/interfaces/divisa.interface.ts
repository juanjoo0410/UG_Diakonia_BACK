import { IBaseMaster } from "./base-master.interface";
import { IDivisaDenominacion } from "./divisa-denominacion.interface";

export interface IDivisa extends IBaseMaster {
    divisaBase: boolean;
    divisaDenominaciones?: IDivisaDenominacion[];
}