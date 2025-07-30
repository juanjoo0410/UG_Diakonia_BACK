export interface IDonante {
    idDonante?: number;
    codigo: string;
    nombre: string;
    tipoPersona: string;
    identificacion: string;
    representanteLegal: string;
    abreviatura: string;
    estado?: boolean;
}