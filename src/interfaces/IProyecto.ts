import { ProyectoInstitucion } from "../models/proyectoInstitucionModel";

export interface IProyecto{
    idProyecto?: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    responsable: string;
    fechaInicio: Date;
    fechaFin?: Date;
    indefinido: boolean;
    presupuesto: number;   
    estado?: boolean;
    proyectoInstitucion?: ProyectoInstitucion[];
}