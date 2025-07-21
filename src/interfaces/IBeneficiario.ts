export interface IBeneficiario{
    idBeneficiario?: number;
    codigo: string;
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