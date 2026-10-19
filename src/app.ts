import "dotenv/config";
import express from "express";
import cors from "cors";
import router from './routes';
import { connectDB } from "./config/db";
import { RBACService } from "./services/rbac.service";
import { RolService } from "./services/rol.service";
import { UsuarioService } from "./services/usuario.service";

const PORT = process.env.PORT;
const app = express();

app.use(cors());
//app.use(express.json())
app.use(express.json({ limit: '1mb' })); 
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(router);
async function startServer() {
    try {
        await connectDB();

        //Configuración inicial (RBAC, Admin)
        const rolService = new RolService();
        const rbacService = new RBACService();
        const usuarioService = new UsuarioService();

        const adminRol = await rolService.ensureAdminRolExists();
        const allSubmenuIds = await rbacService.seedMenusAndSubmenus();
        const allPermissionIds = await rbacService.seedPermissions();
        const allCountersIds = await rbacService.seedCounters();
        await rbacService.assignAllSubmenusToAdmin(adminRol, allSubmenuIds);
        await rbacService.assignAllPermissionsToAdmin(adminRol, allPermissionIds);
        await usuarioService.ensureSuperAdminExists(adminRol);

        console.log('✨ Configuración inicial (RBAC, Admin) completada con éxito.');
        app.listen(PORT, () => {
            console.log(`🚀 API en línea y conectada a la DB en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('🛑 Error Crítico al iniciar la API o la Base de Datos:', error);
        process.exit(1); 
    }
}

startServer();