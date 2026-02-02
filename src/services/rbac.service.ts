import { initialMenuData } from "../config/initial-rbac-data";
import { Menu } from "../models/menuModel";
import { Rol } from "../models/rolModel";
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
}