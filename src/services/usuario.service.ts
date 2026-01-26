import { encrypt } from "../helpers/handleBcrypt";
import { Rol } from "../models/rolModel";
import { Usuario } from "../models/usuarioModel";

export class UsuarioService {
    protected readonly ModelClass = Usuario;

    public async ensureSuperAdminExists(adminRol: Rol): Promise<Usuario | null> {
        const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'Admin';
        const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME || '0921304143';
        const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || '12345';
        const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'jj.echeverriat@gmail.com';
        
        const ROL_ADMIN_ID = adminRol.idRol ?? 0;
        try {
            const existingAdmin = await this.ModelClass.findOne({
                where: { codigo: SUPER_ADMIN_USERNAME }
            });

            if (existingAdmin) return existingAdmin;

            const hashedPassword = await encrypt(SUPER_ADMIN_PASSWORD);

            const newAdmin = await this.ModelClass.create({
                nombre: SUPER_ADMIN_NAME,
                codigo: SUPER_ADMIN_USERNAME,
                clave: hashedPassword,
                correo: SUPER_ADMIN_EMAIL,
                cambiarClave: false,
                idRol: ROL_ADMIN_ID
            } as any);

            return newAdmin;

        } catch (error) {
            console.error('❌ Error al crear el Usuario Administrador inicial:', error);
            return null;
        }
    }
}