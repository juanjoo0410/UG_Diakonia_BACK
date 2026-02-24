import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { BaseCRUDService } from './base-crud.service';
import { IPermiso } from '../interfaces/permiso.interface';
import { Permiso } from '../models/Permiso.model';

type PermisoCreationData = Omit<IPermiso, 'idPermiso' | 'anulado'>;

export class PermisoService extends BaseCRUDService<Permiso> {
    constructor() {
        super(Permiso);
    }

    public async updatePermisoStatus(id: number | string): Promise<Permiso> {
        const Permiso = await this.ModelClass.findByPk(id);
        if (!Permiso) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (Permiso.anulado) {
            newStatus = false;
        }

        Permiso.anulado = newStatus;
        const updatedPermiso = await Permiso.save();

        return updatedPermiso;
    }
}