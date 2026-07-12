import { IBaseMaster } from "./base-master.interface";

export interface ICajaBanco extends IBaseMaster {
    numeroCuenta: string;
    clase: string;
    institucionBancariaId?: number;   
    controlaApertura: boolean;
}