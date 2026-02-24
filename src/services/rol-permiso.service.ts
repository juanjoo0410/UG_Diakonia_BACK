import { BaseCRUDService } from './base-crud.service';
import { RolPermiso } from '../models/RolPermiso.model';
import { Permiso } from '../models/Permiso.model';

export class RolPermisoService extends BaseCRUDService<RolPermiso> {
    constructor() { super(RolPermiso); }

    public async getAllPermisosByIdRol(idRol: number | string): Promise<any[]> {
        try {
            const data = await this.ModelClass.findAll({
                where: { idRol },
                attributes: [],
                include: [{
                    model: Permiso,
                    as: 'permiso',
                    attributes: ['idPermiso', 'codigo'],
                    required: true // Hace un INNER JOIN para asegurar que solo traiga permisos válidos
                }],
                raw: false
            });
            
            return data.map((item: any) => item.permiso);
        } catch (error) {
            throw new Error(`Error en consulta de permisos especiales: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}