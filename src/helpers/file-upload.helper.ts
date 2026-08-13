import * as fs from 'fs';
import * as path from 'path';

export interface IUploadOptions {
    base64OrBuffer: string | Buffer;
    fileNameOriginal: string;
    fileNameActual: string;
    folderName: string;
}

export const saveFileToStorage = (options: IUploadOptions): string => {
    const { base64OrBuffer, fileNameOriginal, fileNameActual, folderName } = options;

    // 1. Obtener directorio base del .env o fallback por defecto
    const baseUploadDir = process.env.UPLOAD_DIR || './uploads';

    // 2. Construir la ruta física completa (Ej: "C:/app/uploads/depositos")
    const targetDir = path.join(baseUploadDir, folderName);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // 4. Generar nombre único manteniendo la extensión original
    const ext = path.extname(fileNameOriginal) || '.jpg';
    const uniqueFileName = `${folderName}-${Date.now()}-${fileNameActual}${ext}`;
    const fullFilePath = path.join(targetDir, uniqueFileName);

    // 5. Convertir y escribir el archivo según el formato recibido
    if (typeof base64OrBuffer === 'string') {
        // Limpia el prefijo data:image/...;base64, si viene desde el front
        const cleanBase64 = base64OrBuffer.replace(/^data:[^;]+;base64,/, '');
        fs.writeFileSync(fullFilePath, Buffer.from(cleanBase64, 'base64'));
    } else {
        fs.writeFileSync(fullFilePath, base64OrBuffer);
    }

    // 6. Retornar la ruta relativa con barras inclinadas Unix (/) para guardar en la BD
    return path.join(folderName, uniqueFileName).replace(/\\/g, '/');
};

export const deleteFileFromStorage = (relativePath: string): boolean => {
    if (!relativePath) return false;

    try {
        const baseUploadDir = process.env.UPLOAD_DIR || './uploads';

        // Reconstruye la ruta absoluta exacta utilizando el mismo baseUploadDir
        const fullFilePath = path.join(baseUploadDir, relativePath);

        if (fs.existsSync(fullFilePath)) {
            fs.unlinkSync(fullFilePath);
            return true;
        }
    } catch (error) {
        console.error(`Error al eliminar archivo en ${relativePath}:`, error);
    }

    return false;
};