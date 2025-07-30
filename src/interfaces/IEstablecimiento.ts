import { Donante } from "../models/donanteModel";

export interface IEstablecimiento {
    idEstablecimiento?: number;
    codigo: string;
    nombre: string;
    identificacion?: string;
    representanteLegal?: string;
    idDonante: number;
    direccion: string;
    direccionUrl: string;
    latitud: number;
    longitud: number;
    idSector: number;
    nombreContacto: string;
    telefono: string;
    correo: string;    
    estado?: boolean;
    donante?: Donante;
}