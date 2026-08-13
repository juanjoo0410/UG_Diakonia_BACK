import { IApertura } from "./apertura.interface";
import { IIngresoTesoreria } from "./ingreso-tesoreria.interface";
import { ITransferenciaBancaria } from "./transferencia-bancaria.interface";

export interface ICerrarCajaData {
    cajaBancoCodigo: string;
    cajaBancoCierreCodigo: string;
    ingreso: IIngresoTesoreria;
    transferencias: ITransferenciaBancaria[];
    apertura: IApertura;
    totalContribuciones: number;
    totalContribucionesEfectivo: number;
    totalContribucionesTransf: number;
    totalEgresos: number;
}