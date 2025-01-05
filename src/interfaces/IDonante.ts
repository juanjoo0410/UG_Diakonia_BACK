export interface IDonante{
    idDonante?: number;
    codigo: string;
    identificacion: string;
    nombre: string;
    tipoPersona: string;
    direccion: string;
    telefono: string;
    correo: string;
    nombreContacto: string;
    abreviatura: string;
    estado?: boolean;
}