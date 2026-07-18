import { IBaseMaster } from "./base-master.interface";
import { IDivisaDenominacion } from "./divisa-denominacion.interface";

export interface IDivisa extends IBaseMaster {
    simbolo: string;
    cambio: number;
    divisaBase: boolean;
    denominaciones?: IDivisaDenominacion[];
}