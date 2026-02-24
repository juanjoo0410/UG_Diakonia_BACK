import { initialMenuData, initialSpecialPermissionsData } from "../config/initial-rbac-data";
import { Menu } from "../models/menuModel";
import { Permiso } from "../models/Permiso.model";
import { Rol } from "../models/rolModel";
import { RolPermiso } from "../models/RolPermiso.model";
import { RolSubmenu } from "../models/rolSubmenuModel";
import { Submenu } from "../models/submenuModel";

export class RBACService {
    public async seedMenusAndSubmenus(): Promise<number[]> {
        const allSubmenuIds: number[] = [];

        for (const menuData of initialMenuData) {
            const [menu, createdMenu] = await Menu.findOrCreate({
                where: { idMenu: menuData.idMenu },
                defaults: { ...menuData }
            });

            let menuUpdated = false;
            if (menu.nombre !== menuData.nombre) {
                menu.nombre = menuData.nombre;
                menuUpdated = true;
            }
            if (menu.icono !== menuData.icono) {
                menu.icono = menuData.icono;
                menuUpdated = true;
            }
            if (menu.orden !== menuData.orden) {
                menu.orden = menuData.orden;
                menuUpdated = true;
            }

            if (menuUpdated) {
                await menu.save();
            }

            for (const submenuData of menuData.submenus) {
                const [submenu, createdSubmenu] = await Submenu.findOrCreate({
                    where: { idSubmenu: submenuData.idSubmenu },
                    defaults: {
                        ...submenuData,
                        idMenu: menu.idMenu
                    }
                });

                let submenuUpdated = false;
                if (submenu.idMenu !== menu.idMenu) {
                    submenu.idMenu = menu.idMenu;
                    submenuUpdated = true;
                }
                if (submenu.nombre !== submenuData.nombre) {
                    submenu.nombre = submenuData.nombre;
                    submenuUpdated = true;
                }
                if (submenu.ruta !== submenuData.ruta) {
                    submenu.ruta = submenuData.ruta;
                    submenuUpdated = true;
                }
                if (submenu.orden !== submenuData.orden) {
                    submenu.orden = submenuData.orden;
                    submenuUpdated = true;
                }

                if (submenuUpdated) await submenu.save();

                allSubmenuIds.push(submenu.idSubmenu);
            }
        }

        console.log(`✨ Menús y Submenús iniciales asegurados/actualizados. Total Submenús: ${allSubmenuIds.length}`);
        return allSubmenuIds;
    }

    public async assignAllSubmenusToAdmin(adminRol: Rol, submenuIds: number[]): Promise<void> {
        const adminRolId = adminRol.idRol ?? 0;
        let assignmentsCount = 0;

        await Promise.all(submenuIds.map(async (submenuId) => {
            const [rolSubmenu, created] = await RolSubmenu.findOrCreate({
                where: {
                    idRol: adminRolId,
                    idSubmenu: submenuId
                },
                defaults: {
                    idRol: adminRolId,
                    idSubmenu: submenuId
                }
            });

            if (created) {
                assignmentsCount++;
            }
        }));
    }

    public async seedPermissions(): Promise<number[]> {
        const allPermissionIds: number[] = [];

        for (const permissionData of initialSpecialPermissionsData) {
            const [permission, createdPermission] = await Permiso.findOrCreate({
                where: { idPermiso: permissionData.idPermiso },
                defaults: { ...permissionData }
            });

            let permissionUpdated = false;
            if (permission.codigo !== permissionData.codigo) {
                permission.codigo = permissionData.codigo;
                permissionUpdated = true;
            }

            if (permissionUpdated) {
                await permission.save();
            }

            allPermissionIds.push(permission.idPermiso);
        }
        console.log(`✨ Permisos iniciales asegurados/actualizados. Total: ${allPermissionIds.length}`);
        return allPermissionIds;
    }

    public async assignAllPermissionsToAdmin(adminRol: Rol, permissionIds: number[]): Promise<void> {
        const adminRolId = adminRol.idRol ?? 0;
        let assignmentsCount = 0;

        await Promise.all(permissionIds.map(async (permissionId) => {
            const [rolPermiso, created] = await RolPermiso.findOrCreate({
                where: {
                    idRol: adminRolId,
                    idPermiso: permissionId
                },
                defaults: {
                    idRol: adminRolId,
                    idPermiso: permissionId
                }
            });

            if (created) {
                assignmentsCount++;
            }
        }));
    }
}