import { IArea } from "./area.interface";
import { IInstalacionExterna } from "./instalacion-externa.interface";
import { IInstitucion } from "./IInstitucion";
import { ITipoJornada } from "./tipo-jornada.interface";
import { IVoluntario } from "./voluntario.interface";

export interface IAsistenciaVoluntario{
    idAsistenciaVoluntario?: number;
    semana: number;
    fecha: Date;
    idInstitucion?: number;
    institucion?: IInstitucion;
    familia: boolean;
    voluntarioEducativo: boolean;
    voluntarioCorporativo: boolean;
    idVoluntario: number;
    voluntario?: IVoluntario;
    idTipoJornada: number;
    tipoJornada?: ITipoJornada;
    recibeKit: boolean;
    recibeAlimentacion: boolean;
    estatus: string;
    idInstalacionExterna: number;
    instalacionExterna?: IInstalacionExterna;
    observacion1: string;
    observacion2: string;
    idArea: number;
    area?: IArea;
}