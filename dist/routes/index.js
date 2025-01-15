"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const ROUTES_PATH = __dirname;
const router = (0, express_1.Router)();
// Función para limpiar el nombre del archivo
const cleanFileName = (filename) => {
    const file = filename.split('.').shift();
    return file; // Manejo de undefined en caso de que `shift` devuelva undefined
};
// Lee el contenido del directorio y filtra los archivos
(0, fs_1.readdirSync)(ROUTES_PATH).filter((filename) => {
    let cleanName = cleanFileName(filename);
    if (cleanName !== 'index') {
        const modulePath = path_1.default.join(ROUTES_PATH, `${cleanName}`);
        if (cleanName.includes('Routes')) {
            cleanName = cleanName.replace('Routes', '');
        }
        Promise.resolve(`${modulePath}`).then(s => __importStar(require(s))).then((module) => {
            const validRoute = module.default || module;
            router.use(`/${cleanName}`, validRoute);
            console.log(`Ruta /${cleanName} registrada exitosamente.`);
        }).catch((error) => {
            console.error(`Error al importar la ruta ${modulePath}:`, error.message);
        });
    }
});
exports.default = router;
