export interface IEmpresa{
    idEmpresa?: number;
    ruc: string;
    razonSocial: string;
    representanteLegal: string;
    direccion: string;
    telefono: string;
    rutaLogo: string;
    obligadoContabilidad: boolean;
    estado?: boolean;
}