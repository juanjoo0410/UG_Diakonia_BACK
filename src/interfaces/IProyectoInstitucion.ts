import { Institucion } from "../models/institucionModel";
import { Proyecto } from "../models/proyectoModel";

export interface IProyectoInstitucion {
    idProyectoInstitucion?: number;
    idProyecto: number;
    idInstitucion: number;
    proyecto?: Proyecto;
    institucion?: Institucion;
}