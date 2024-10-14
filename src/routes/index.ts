import express, { Router } from 'express';
import path from 'path';
import { readdirSync } from 'fs';

const ROUTES_PATH: string = __dirname;
const router = Router();

// Función para limpiar el nombre del archivo
const cleanFileName = (filename: string) => {
    const file = filename.split('.').shift();
    return file; // Manejo de undefined en caso de que `shift` devuelva undefined
};

// Lee el contenido del directorio y filtra los archivos
readdirSync(ROUTES_PATH).filter((filename: string) => {
    let cleanName = cleanFileName(filename);
    if (cleanName !== 'index') {
        const modulePath = path.join(ROUTES_PATH, `${cleanName}`);

        if (cleanName!.includes('Routes')) {
            cleanName = cleanName!.replace('Routes', '');
        }

        import(modulePath).then((module) => {
            const validRoute = module.default || module;
            router.use(`/${cleanName}`, validRoute);
            console.log(`Ruta /${cleanName} registrada exitosamente.`);
        }).catch((error) => {
            console.error(`Error al importar la ruta ${modulePath}:`, error.message);
        });
    }
});

export default router;