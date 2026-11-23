import { AutoidentificacionEtnica } from "../models/autoidentificacion-etnica.model";
import { BaseCRUDService } from "./base-crud.service";

export class AutoidentificacionEtnicaService extends BaseCRUDService<AutoidentificacionEtnica> {
    constructor() {
        super(AutoidentificacionEtnica);
    }
}