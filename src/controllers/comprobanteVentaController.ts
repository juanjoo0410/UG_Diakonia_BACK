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
import { col, fn, Op } from 'sequelize';
import { Producto } from '../models/productoModel';

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
            await transaction.rollback();
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
                valorCupon: comprobanteVenta.valorCupon,
                total: comprobanteVenta.total,
                totalPeso: comprobanteVenta.totalPeso,
                usuario: comprobanteVenta.usuario
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
                subtotal: detalle.subtotal,
                descuento: detalle.descuento,
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
    console.log(fechaInicio + "-" + fechaFin);
    try {
        console.log(fechaInicio + "-" + fechaFin);
        const comprobanteVenta = await ComprobanteVenta.findAll({
            where: {
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['codigo', 'identificacion', 'nombre', 'esEmpleado']
            },
            {
                model: ComprobanteVentaDt,
                as: 'comvenDetalles',
                include: [{
                    model: Producto,
                    as: 'producto',
                    attributes: ['descripcion']
                }]
            }
            ]
        });
        res.status(200).json({ status: true, value: comprobanteVenta });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getVentasByTipoPago = async (req: Request, res: Response) => {
    try {
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        const finMes = new Date();
        finMes.setMonth(finMes.getMonth() + 1); // Siguiente mes
        finMes.setDate(0); // Último día del mes
        finMes.setHours(23, 59, 59, 999);

        const ventasPorTipoPago = await ComprobanteVenta.findAll({
            attributes: [["tipoPago", "name"], [fn("SUM", col("total")), "value"]],
            where: { fecha: { [Op.between]: [inicioMes, finMes] } },
            group: ["tipoPago"],
        });

        res.status(200).json({
            status: true,
            value: ventasPorTipoPago
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotalVentasMensual = async (req: Request, res: Response) => {
    try {
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        const finMes = new Date();
        finMes.setMonth(finMes.getMonth() + 1); // Siguiente mes
        finMes.setDate(0); // Último día del mes
        finMes.setHours(23, 59, 59, 999);

        const totalVentas = await ComprobanteVenta.findOne({
            attributes: [[fn('SUM', col('total')), 'totalVentas']],
            where: {
                fecha: {
                    [Op.between]: [inicioMes, finMes],
                },
            },
            raw: true,
        });
        res.status(200).json({
            status: true,
            value: totalVentas
        });
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

const deleteComprobanteVenta = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const comprobante = await ComprobanteVenta.findByPk(id);
        const comprobanteDt = await ComprobanteVentaDt.findAll({ where: {idComprobanteVenta : id}});
        if (!comprobante) {
            await transaction.rollback();
            res.status(404).json({
                status: false,
                message: 'Comprobante no encontrado. Imposible anular.'
            });
            return;
        }

        comprobante.estado = false;
        await comprobante.save({transaction});
        await ComprobanteVentaDt.update({ estado: false }, { where: { idComprobanteVenta: id }, transaction });

        const cliente = await Cliente.findByPk(comprobante.idCliente);
        const documento = {
            idDocumento: comprobante.idComprobanteVenta,
            tipo: entidad,
            detalle: `Anulación Comprobante de cliente: ${cliente?.nombre}.`,
            esIngreso: true
        }
        await actualizarStock(comprobanteDt, true, transaction);
        await agregarKardex(documento, comprobanteDt, transaction);
        await transaction.commit();
        res.status(200).json({
            status: true,
            message: 'Comprobante anulado exitosamente'
        });
        await registrarBitacora(req, 'ANULACIÓN', entidad,
            `Se anuló el comprobante No. ${comprobante.idComprobanteVenta}.`);
    } catch (error) {
        await transaction.rollback();
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createComprobanteVenta,
    getComprobantesVenta,
    getTotalVentasMensual,
    getVentasByTipoPago,
    getComprobanteVentaById,
    deleteComprobanteVenta
}