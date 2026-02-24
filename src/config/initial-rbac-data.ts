export const initialMenuData = [
    {
        idMenu: 2,
        nombre: 'Home',
        icono: 'home',
        ruta: '/main/dashboard',
        orden: 1,
        anulado: false,
        submenus: []
    },
    {
        idMenu: 3,
        nombre: 'Donantes',
        icono: 'volunteer_activism',
        orden: 2,
        submenus: [
            {
                idSubmenu: 5,
                nombre: 'Donantes',
                ruta: '/main/pages/donantes/donantes',
                orden: 1
            },
            {
                idSubmenu: 6,
                nombre: 'Establecimientos',
                ruta: '/main/pages/donantes/establecimientos',
                orden: 2
            },
            {
                idSubmenu: 7,
                nombre: 'Histórico de Donaciones',
                ruta: '/main/pages/donantes/historico',
                orden: 3
            },
        ]
    },
    {
        idMenu: 4,
        nombre: 'Instituciones',
        icono: 'diversity_3',
        orden: 3,
        submenus: [
            {
                idSubmenu: 8,
                nombre: 'Tipos de Organización',
                ruta: '/main/pages/instituciones/tipo-org',
                orden: 1
            },
            {
                idSubmenu: 9,
                nombre: 'Tipos de Población',
                ruta: '/main/pages/instituciones/tipo-poblacion',
                orden: 2
            },
            {
                idSubmenu: 10,
                nombre: 'Instituciones',
                ruta: '/main/pages/instituciones/instituciones',
                orden: 3
            },
            {
                idSubmenu: 11,
                nombre: 'Distribuciones a Instituciones',
                ruta: '/main/pages/instituciones/distribuciones',
                orden: 4
            },
            {
                idSubmenu: 31,
                nombre: 'Planificación',
                ruta: '/main/pages/instituciones/planner',
                orden: 5
            },
        ]
    },
    {
        idMenu: 5,
        nombre: 'Inventario',
        icono: 'inventory_2',
        orden: 7,
        submenus: [
            {
                idSubmenu: 12,
                nombre: 'Bodegas',
                ruta: '/main/pages/inventario/bodegas',
                orden: 1
            },
            {
                idSubmenu: 13,
                nombre: 'Ubicaciones',
                ruta: '/main/pages/inventario/ubicaciones',
                orden: 2
            },
            {
                idSubmenu: 14,
                nombre: 'Grupos',
                ruta: '/main/pages/inventario/grupos',
                orden: 3
            },
            {
                idSubmenu: 15,
                nombre: 'Subgrupos',
                ruta: '/main/pages/inventario/subgrupos',
                orden: 4
            },
            {
                idSubmenu: 16,
                nombre: 'Categorías',
                ruta: '/main/pages/inventario/categorias',
                orden: 5
            },
            {
                idSubmenu: 17,
                nombre: 'Productos',
                ruta: '/main/pages/inventario/productos',
                orden: 6
            },
            {
                idSubmenu: 18,
                nombre: 'Nota de Ingreso',
                ruta: '/main/pages/inventario/emision-ing',
                orden: 7
            },
            {
                idSubmenu: 19,
                nombre: 'Nota de Egreso',
                ruta: '/main/pages/inventario/emision-eg',
                orden: 8
            },
            {
                idSubmenu: 20,
                nombre: 'Transferencia',
                ruta: '/main/pages/inventario/emision-transf',
                orden: 9
            },
            {
                idSubmenu: 21,
                nombre: 'Informe de Ingresos',
                ruta: '/main/pages/inventario/ingresos',
                orden: 10
            },
            {
                idSubmenu: 22,
                nombre: 'Informe de Egresos',
                ruta: '/main/pages/inventario/egresos',
                orden: 11
            },
            {
                idSubmenu: 23,
                nombre: 'Informe de Transferencias',
                ruta: '/main/pages/inventario/transferencias',
                orden: 12
            },
            {
                idSubmenu: 24,
                nombre: 'Stock',
                ruta: '/main/pages/inventario/stock',
                orden: 13
            },
            {
                idSubmenu: 25,
                nombre: 'Kardex',
                ruta: '/main/pages/inventario/kardex',
                orden: 14
            },
        ]
    },
    {
        idMenu: 6,
        nombre: 'Tiendita',
        icono: 'store',
        orden: 8,
        submenus: [
            {
                idSubmenu: 26,
                nombre: 'Beneficiarios',
                ruta: '/main/pages/tiendita/beneficiarios',
                orden: 1
            },
            {
                idSubmenu: 27,
                nombre: 'Asignación de Precios',
                ruta: '/main/pages/tiendita/precios',
                orden: 2
            },
            {
                idSubmenu: 28,
                nombre: 'Nuevo Comprobante',
                ruta: '/main/pages/tiendita/comprobante',
                orden: 3
            },
            {
                idSubmenu: 29,
                nombre: 'Informe de Comprobantes',
                ruta: '/main/pages/tiendita/comprobantes',
                orden: 4
            },
            {
                idSubmenu: 32,
                nombre: 'Saldos',
                ruta: '/main/pages/tiendita/saldos',
                orden: 5
            },
            {
                idSubmenu: 36,
                nombre: 'Impresión de Etiquetas',
                ruta: '/main/pages/tiendita/etiquetas',
                orden: 6
            },
            {
                idSubmenu: 39,
                nombre: 'Distribución de Productos',
                ruta: '/main/pages/tiendita/distribucion-productos',
                orden: 6
            },
        ]
    },
    {
        idMenu: 7,
        nombre: 'Administración',
        icono: 'settings',
        orden: 9,
        submenus: [
            {
                idSubmenu: 1,
                nombre: 'Roles',
                ruta: '/main/pages/admin/roles',
                orden: 2
            },
            {
                idSubmenu: 2,
                nombre: 'Usuarios',
                ruta: '/main/pages/admin/usuarios',
                orden: 3
            },
            {
                idSubmenu: 3,
                nombre: 'Empresa',
                ruta: '/main/pages/admin/empresa',
                orden: 4
            },
            {
                idSubmenu: 30,
                nombre: 'Configuración',
                ruta: '/main/pages/admin/settings',
                orden: 5
            },
            {
                idSubmenu: 33,
                nombre: 'Sectores',
                ruta: '/main/pages/admin/sectores',
                orden: 1
            },
        ]
    },
    {
        idMenu: 8,
        nombre: 'Seguridad',
        icono: 'lock',
        orden: 10,
        submenus: [
            {
                idSubmenu: 4,
                nombre: 'Bitácora',
                ruta: '/main/pages/seguridad/bitacora',
                orden: 1
            },
        ]
    },
    {
        idMenu: 9,
        nombre: 'Proyectos',
        icono: 'assignment',
        orden: 6,
        submenus: [
            {
                idSubmenu: 34,
                nombre: 'Proyectos',
                ruta: '/main/pages/proyectos/proyectos',
                orden: 1
            },
        ]
    },
    {
        idMenu: 10,
        nombre: 'Mapeo',
        icono: 'map',
        orden: 5,
        submenus: [
            {
                idSubmenu: 35,
                nombre: 'Mapeo de Entidades',
                ruta: '/main/pages/mapeo/mapeo',
                orden: 1
            },
        ]
    },
    {
        idMenu: 11,
        nombre: 'Voluntariado',
        icono: 'front_hand',
        orden: 4,
        submenus: [
            {
                idSubmenu: 37,
                nombre: 'Voluntarios',
                ruta: '/main/pages/voluntariado/voluntarios',
                orden: 1
            },
            {
                idSubmenu: 38,
                nombre: 'Asistencia de Voluntarios',
                ruta: '/main/pages/voluntariado/asistencias',
                orden: 2
            }
        ]
    }
];

export const initialSpecialPermissionsData = [
    {
        idPermiso: 1,
        codigo: 'DSB-SHOW-TIENDITA',
        anulado: false,
    },
    {
        idPermiso: 2,
        codigo: 'DSB-SHOW-VOLUNTARIADO',
        anulado: false,
    },
    {
        idPermiso: 3,
        codigo: 'DSB-SHOW-INVENTARIO',
        anulado: false,
    },
    {
        idPermiso: 4,
        codigo: 'DSB-SHOW-INSTITUCIONES',
        anulado: false,
    },
];