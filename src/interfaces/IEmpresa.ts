export interface IEmpresa {
    idEmpresa?: number;
    ruc: string;
    razonSocial: string;
    representanteLegal: string;
    direccion: string;
    telefono: string;
    direccionUrl: string;
    latitud: number;
    longitud: number;
    rutaLogo: string;
    obligadoContabilidad: boolean;
    estado?: boolean;
}