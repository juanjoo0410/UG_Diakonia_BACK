export interface IBeneficiario{
    idBeneficiario?: number;
    codigo: string;
    esExtranjero: boolean;
    identificacion: string;
    nombre: string;
    estadoCivil: string;
    sexo: string;
    direccion: string;
    telefono: string;
    correo: string;
    esEmpleado: boolean;
    estado?: boolean;
}