import { IBeneficiario } from "./IBeneficiario";

export interface IEmpresaPatrocinadoraBeneficiario {
    id?: number;
    empresaPatrocinadoraId: number;
    beneficiarioId: number;
    anulado?: boolean;
    beneficiario?: IBeneficiario;
}