import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import sequelize from "../config/db";
import { IComprobanteVenta } from '../interfaces/IComprobanteVenta';
import { ComprobanteVenta } from '../models/comprobanteVentaModel';
import { IComprobanteVentaDt } from '../interfaces/IComprobanteVentaDt';
import { ComprobanteVentaDt } from '../models/comprobanteVentaDtModel';
import { Cliente } from '../models/clienteModel';
import { actualizarStock } from '../utils/stockService';
import { agregarKardex } from '../utils/kardexService';
import { Op } from 'sequelize';

const entidad = 'COMPROBANTE_VENTA';

const createComprobanteVenta = async (
    req: Request<{}, {}, Omit<IComprobanteVenta, 'idComprobanteVenta' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const comprobanteVenta: Omit<IComprobanteVenta, 'idComprobanteVenta' | 'estado'> = req.body;
        if (!comprobanteVenta.comprobanteVentaDt ||
            !Array.isArray(comprobanteVenta.comprobanteVentaDt) ||
            comprobanteVenta.comprobanteVentaDt.length === 0) {
            res.status(400).json({
                status: false,
                message: "Detalle del comprobante es requerido"
            });
            return;
        }
        const newComprobanteVenta = await ComprobanteVenta.create(
            {
                idCliente: comprobanteVenta.idCliente,
                tipoPago: comprobanteVenta.tipoPago,
                banco: comprobanteVenta.banco,
                subtotal: comprobanteVenta.subtotal,
                descuento: comprobanteVenta.descuento,
                total: comprobanteVenta.total,
            },
            { transaction }
        );
        const cliente = await Cliente.findByPk(comprobanteVenta.idCliente);
        const detalles = comprobanteVenta.comprobanteVentaDt.map((
            detalle: Omit<IComprobanteVentaDt, 'idComprobanteVentaDt' | 'estado'>) => ({
                idComprobanteVenta: newComprobanteVenta.idComprobanteVenta ?? 0,
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                cantidad: detalle.cantidad,
                precioUnd: detalle.precioUnd,
                total: detalle.total,
                peso: detalle.peso
            }));
        const documento = {
            idDocumento: newComprobanteVenta.idComprobanteVenta,
            tipo: entidad,
            detalle: `Venta a cliente: ${cliente?.nombre}.`,
            esIngreso: false
        }
        await ComprobanteVentaDt.bulkCreate(detalles, { transaction });
        await actualizarStock(detalles, false, transaction);
        await agregarKardex(documento, detalles, transaction);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Comprobante de venta creado con éxito',
            value: newComprobanteVenta
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el comprobante de venta ${newComprobanteVenta.idComprobanteVenta}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getComprobantesVenta = async (req: Request, res: Response) => {
    const { fechaInicio, fechaFin } = req.body;
    try {
        const comprobanteVenta = await ComprobanteVenta.findAll({
            where: {
                estado: true,
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['codigo', 'identificacion', 'nombre', 'esEmpleado']
            }]
        });
        res.status(200).json({ status: true, value: comprobanteVenta });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getComprobanteVentaById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const comprobanteVenta = await ComprobanteVenta.findOne({
            where: { idComprobanteVenta: id },
            include: [
                {
                    model: ComprobanteVentaDt,
                    as: "comvenDetalles",
                }
            ],
        });
        if (!comprobanteVenta) res.status(404).json({
            status: false,
            message: 'Comprobante de venta no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: comprobanteVenta
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

export {
    createComprobanteVenta,
    getComprobantesVenta,
    getComprobanteVentaById
}