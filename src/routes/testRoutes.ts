import { Router } from "express";
import sequelize from "../config/db";

const router = Router();
const packageJson = require('../../package.json');

router.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.status(200).json({
            status: true,
            name: packageJson.name || '',
            version: packageJson.version || '',
            environment: process.env.NODE_ENV || 'development',
            database: 'connected',
            message: 'Conexión a la base de datos exitosa 🚀'
        });
    } catch (error) {
        console.error('Error de conexión:', error);
        res.status(500).json({
            status: false,
            message: 'Error de conexión a la base de datos', error
        });
    }
});

export default router;