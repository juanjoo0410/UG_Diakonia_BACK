import { Donante } from "../models/donanteModel";

export interface IEstablecimiento {
    idEstablecimiento?: number;
    codigo: string;
    nombre: string;
    idDonante: number;
    direccion: string;
    telefono: string;
    estado?: boolean;
    donante?: Donante;
}