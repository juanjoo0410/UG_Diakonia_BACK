import { IBaseMaster } from "./base-master.interface";
import { IEmpresaPatrocinadoraBeneficiario } from "./empresa-patrocinadora-beneficiario.interface";

export interface IEmpresaPatrocinadora extends IBaseMaster {
    ruc: string;
    beneficiarios?: IEmpresaPatrocinadoraBeneficiario[];
}