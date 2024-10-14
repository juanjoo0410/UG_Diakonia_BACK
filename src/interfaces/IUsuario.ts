export interface IUsuario {
    id_usario: number;
    nombre: string;
    codigo: string;
    clave: string;
    anulado: boolean;
    creado_date: Date;
    creado_por: string;
}