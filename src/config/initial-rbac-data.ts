export const initialMenuData = [
    {
        idMenu: 1,
        nombre: 'Homeeee',
        icono: 'home',
        ruta: '/main/dashboard',
        orden: 1,
        anulado: false,
        submenus: []
    },
    {
        idMenu: 2,
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
        idMenu: 3,
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
];