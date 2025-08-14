import { Router } from "express";
import sequelize from "../config/db";

const router = Router();

router.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'ok',
            message: 'Conexión a la base de datos exitosa 🚀'
        });
    } catch (error) {
        console.error('Error de conexión:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error de conexión a la base de datos', error
        });
    }
});

export default router;