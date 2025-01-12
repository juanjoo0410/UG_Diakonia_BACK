import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { Banco } from '../models/bancoModel';

const getBancos = async (req: Request, res: Response) => {
    try {
        const bancos = await Banco.findAll({ where: { estado: true } });
        res.status(200).json({ value: bancos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    getBancos
}