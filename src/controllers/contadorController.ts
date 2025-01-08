import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { IContador } from '../interfaces/IContador';
import { Contador } from '../models/contadorModel';

const createContador = async (
    req: Request<{}, {}, Omit<IContador, 'idContador' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const contador: Omit<IContador, 'idContador' | 'estado'> = req.body;
        const checkIs = await Contador.findOne({ where: { nombre: contador.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El nombre del contador ya existe'
            });
        } else {
            const newContador = await Contador.create(contador);
            res.status(201).json({
                status: true,
                message: 'Contador agregado exitosamente.',
                value: newContador
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getContadores = async (req: Request, res: Response) => {
    try {
        const contadores = await Contador.findAll({ where: { estado: true } });
        res.status(200).json({ value: contadores });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    createContador,
    getContadores
}