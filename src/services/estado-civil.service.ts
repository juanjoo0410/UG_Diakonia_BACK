import { EstadoCivil } from "../models/estado-civil.model";
import { BaseCRUDService } from "./base-crud.service";

export class EstadoCivilService extends BaseCRUDService<EstadoCivil> {
    constructor() {
        super(EstadoCivil);
    }
}