import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import sequelize from "../config/db";
import { ITransferencia } from '../interfaces/ITransferencia';
import { Transferencia } from '../models/transferenciaModel';
import { ITransferenciaDt } from '../interfaces/ITransferenciaDt';
import { TransferenciaDt } from '../models/transferenciaDtModel';
import { actualizarStock } from '../utils/stockService';
import { agregarKardex } from '../utils/kardexService';
import { Op } from 'sequelize';
import { Bodega } from '../models/bodegaModel';
import { Producto } from '../models/productoModel';
import { Ubicacion } from '../models/ubicacionModel';

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
                totalPeso: transferencia.totalPeso,
                usuario: transferencia.usuario
            },
            { transaction }
        );
        const detalles = transferencia.transferenciaDt.map((
            detalle: Omit<ITransferenciaDt, 'idTransferenciaDt' | 'estado'>) => ({
                idTransferencia: newTransferencia.idTransferencia ?? 0,
                idProducto: detalle.idProducto,
                idBodegaOrigen: detalle.idBodegaOrigen,
                idBodegaDestino: detalle.idBodegaDestino,
                idUbicacionOrigen: detalle.idUbicacionOrigen,
                idUbicacionDestino: detalle.idUbicacionDestino,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            }));

        await TransferenciaDt.bulkCreate(detalles, { transaction });
        const documento = {
            idDocumento: newTransferencia.idTransferencia,
            tipo: entidad,
            detalle: `Egreso: ${newTransferencia.descripcion}`,
            esIngreso: false
        };
        const detallesEg = detalles.map((
            detalle: any) => ({
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodegaOrigen,
                idUbicacion: detalle.idUbicacionOrigen,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            }));
        const detallesIng = detalles.map((
            detalle: any) => ({
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodegaDestino,
                idUbicacion: detalle.idUbicacionDestino,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            }));
        await actualizarStock(detallesEg, documento.esIngreso, transaction);
        await agregarKardex(documento, detallesEg, transaction);

        documento.esIngreso = true;
        documento.detalle = `Ingreso: ${newTransferencia.descripcion}`
        await actualizarStock(detallesIng, documento.esIngreso, transaction);
        await agregarKardex(documento, detallesIng, transaction);
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
    const { fechaInicio, fechaFin } = req.body;
    try {
        const transferencias = await Transferencia.findAll({
            where: {
                estado: true,
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                model: TransferenciaDt,
                as: 'transfDetalles',
                include: [{
                    model: Producto,
                    as: 'producto',
                    attributes: ['descripcion']
                },
                {
                    model: Bodega,
                    as: 'bodegaOrigen',
                    attributes: ['nombre']
                },
                {
                    model: Ubicacion,
                    as: 'ubicacionOrigen',
                    attributes: ['codigo']
                },
                {
                    model: Bodega,
                    as: 'bodegaDestino',
                    attributes: ['nombre']
                },
                {
                    model: Ubicacion,
                    as: 'ubicacionDestino',
                    attributes: ['codigo']
                }]
            }]
        });
        res.status(200).json({ status: true, value: transferencias });
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