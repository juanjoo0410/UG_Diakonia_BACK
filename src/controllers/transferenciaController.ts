import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import sequelize from "../config/db";
import { ITransferencia } from '../interfaces/ITransferencia';
import { Transferencia } from '../models/transferenciaModel';
import { ITransferenciaDt } from '../interfaces/ITransferenciaDt';
import { TransferenciaDt } from '../models/transferenciaDtModel';

const entidad = 'TRANSFERENCIA';

const createTransferencia = async (
    req: Request<{}, {}, Omit<ITransferencia, 'idTransferencia' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const transferencia: Omit<ITransferencia, 'idTransferencia' | 'estado'> = req.body;
        if (!transferencia.transferenciaDt || 
            !Array.isArray(transferencia.transferenciaDt) || 
            transferencia.transferenciaDt.length === 0) {
            res.status(400).json({
                status: false,
                message: "Detalle de la transferencia es requerido"
            });
            return;
        }
        const newTransferencia = await Transferencia.create(
            {
                descripcion: transferencia.descripcion,
                idBodegaOrigen:  transferencia.idBodegaOrigen,
                idBodegaDestino:  transferencia.idBodegaDestino,
                totalPeso: transferencia.totalPeso,
            },
            { transaction }
        );
        const detalles = transferencia.transferenciaDt.map((
            detalle: Omit<ITransferenciaDt, 'idTransferenciaDt' | 'estado'>) => ({
                idTransferencia: newTransferencia.idTransferencia ?? 0,
                idProducto: detalle.idProducto,
                idUbicacionOrigen: detalle.idUbicacionOrigen,
                idUbicacionDestino: detalle.idUbicacionDestino,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            }));
        await TransferenciaDt.bulkCreate(detalles, { transaction });
        await transaction.commit();
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó la transferencia ${newTransferencia.idTransferencia}.`);
        res.status(201).json({
            status: true,
            message: 'Transferencia creada con éxito',
            value: newTransferencia
        });
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getTransferencias = async (req: Request, res: Response) => {
    try {
        const transferencias = await Transferencia.findAll({ where: { estado: true } });
        res.status(200).json({ value: transferencias });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTransferenciaById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const transferencia = await Transferencia.findOne({
            where: { idTransferencia: id },
            include: [
                {
                    model: TransferenciaDt,
                    as: "transfDetalles",
                }
            ],
        });
        if (!transferencia) res.status(404).json({
            status: false,
            message: 'Transferencia no encontrada'
        });
        else res.status(200).json({
            status: true,
            value: transferencia
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

export {
    createTransferencia,
    getTransferencias,
    getTransferenciaById
}