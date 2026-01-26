import { Rol } from "../models/rolModel";

export class RolService {
    protected readonly ModelClass = Rol;

    public async ensureAdminRolExists(): Promise<Rol> {
        const ROL_ADMIN_NAME = 'Administrador';
        const [adminRol, created] = await this.ModelClass.findOrCreate({
            where: { nombre: ROL_ADMIN_NAME },
            defaults: {
                nombre: ROL_ADMIN_NAME
            } as any
        });

        return adminRol;
    }
}