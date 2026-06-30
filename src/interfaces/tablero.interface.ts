import { ITableroUsuario } from "./tablero-usuario.interface";

export interface ITablero {
    id?: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    url: string;
    todos: boolean;
    estado?: boolean;
    tablerosUsuarios?: ITableroUsuario[];
}