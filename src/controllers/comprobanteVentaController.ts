import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import sequelize from "../config/db";
import { IComprobanteVenta } from '../interfaces/IComprobanteVenta';
import { ComprobanteVenta } from '../models/comprobanteVentaModel';
import { IComprobanteVentaDt } from '../interfaces/IComprobanteVentaDt';
import { ComprobanteVentaDt } from '../models/comprobanteVentaDtModel';
import { Beneficiario } from '../models/beneficiarioModel';
import { actualizarStock } from '../utils/stockService';
import { agregarKardex } from '../utils/kardexService';
import { col, fn, literal, Op, where } from 'sequelize';
import { Producto } from '../models/productoModel';

const entidad = 'COMPROBANTE_TIENDITA';

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
                idBeneficiario: comprobanteVenta.idBeneficiario,
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
        const beneficiario = await Beneficiario.findByPk(comprobanteVenta.idBeneficiario);
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
            detalle: `Comprobante: ${beneficiario?.nombre}.`,
            esIngreso: false
        }
        await ComprobanteVentaDt.bulkCreate(detalles, { transaction });
        await actualizarStock(detalles, false, transaction);
        await agregarKardex(documento, detalles, transaction);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Comprobante creado con éxito',
            value: newComprobanteVenta
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el comprobante ${newComprobanteVenta.idComprobanteVenta}.`);
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
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                model: Beneficiario,
                as: 'beneficiario',
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
    const { mes, anio } = req.body;
    const mesNum = parseInt(mes as string);
    const anioNum = parseInt(anio as string);

    try {
        if (isNaN(mesNum) || isNaN(anioNum)) {
            res.status(400).json({
                status: false,
                message: "Mes y año inválidos."
            });
            return;
        }

        let inicioMes: Date;
        let finMes: Date;

        if (mesNum === 0) {
            inicioMes = new Date(anioNum, 0, 1, 0, 0, 0, 0);
            finMes = new Date(anioNum, 11, 31, 23, 59, 59, 999);
        } else {
            inicioMes = new Date(anioNum, mesNum - 1, 1, 0, 0, 0, 0);
            finMes = new Date(anioNum, mesNum, 0, 23, 59, 59, 999);
        }

        const ventas = await ComprobanteVenta.findAll({
            attributes: [["tipoPago", "name"], [fn("SUM", col("total")), "value"]],
            where: {
                estado: true,
                fecha: { [Op.between]: [inicioMes, finMes] }
            },
            group: ["tipoPago"]
        });

        // Convertimos el resultado a un diccionario
        const tiposDePago = ['Efectivo', 'Transferencia', 'Crédito'];
        const ventasDict: { [key: string]: number } = {};

        for (const venta of ventas) {
            const name = venta.get('name') as string;
            const value = parseFloat(venta.get('value') as string);
            ventasDict[name] = value;
        }

        // Generamos la respuesta asegurando los 3 tipos
        const resultado = tiposDePago.map(tipo => ({
            name: tipo,
            value: ventasDict[tipo] || 0
        }));

        res.status(200).json({
            status: true,
            value: resultado
        });

    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotalVentasMensual = async (req: Request, res: Response) => {
    const { mes, anio } = req.body;
    const mesNum = parseInt(mes as string);
    const anioNum = parseInt(anio as string);
    try {
        if (isNaN(mesNum) || isNaN(anioNum)) {
            res.status(400).json({
                status: false,
                message: "Mes y año inválidos."
            });
            return;
        }

        let inicioMes: Date;
        let finMes: Date;

        if (mesNum === 0) {
            inicioMes = new Date(anioNum, 0, 1, 0, 0, 0, 0);
            finMes = new Date(anioNum, 11, 31, 23, 59, 59, 999);
        } else {
            inicioMes = new Date(anioNum, mesNum - 1, 1, 0, 0, 0, 0);
            finMes = new Date(anioNum, mesNum, 0, 23, 59, 59, 999);
        }

        const totalVentas = await ComprobanteVenta.findOne({
            attributes: [[fn('SUM', col('total')), 'totalVentas']],
            where: {
                estado: true,
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

const getProductosDemandantes = async (req: Request, res: Response) => {
    const { mes, anio } = req.body;
    const mesNum = parseInt(mes as string);
    const anioNum = parseInt(anio as string);
    try {
        if (isNaN(mesNum) || isNaN(anioNum)) {
            res.status(400).json({
                status: false,
                message: "Mes y año inválidos."
            });
            return;
        }

        const whereConditions: any = {
            [Op.and]: [
                where(fn('YEAR', col('comprobanteVenta.fecha')), anio),
                { '$comprobanteVenta.estado$': 1 }
            ]
        };

        if (mes !== 0) {
            whereConditions[Op.and].push(
                where(fn('MONTH', col('comprobanteVenta.fecha')), mes)
            );
        }

        const resumen = await ComprobanteVentaDt.findAll({
            attributes: [
                [col('producto.descripcion'), 'name'],
                [literal('CAST(SUM(cantidad) AS UNSIGNED)'), 'value']
            ],
            where: whereConditions,
            include: [
                {
                    model: ComprobanteVenta,
                    as: 'comprobanteVenta',
                    attributes: []
                },
                {
                    model: Producto,
                    as: 'producto',
                    attributes: []
                }
            ],
            group: [col('producto.descripcion')],
            order: [[fn('SUM', col('cantidad')), 'DESC']],
            limit: 10,
            raw: true
        });

        res.status(200).json({
            status: true,
            value: resumen
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_PRODUCTOS_DEMANDANTES', error);
    }
};

const getTotalProductos = async (req: Request, res: Response) => {
    const { fechaInicio, fechaFin } = req.body;
    try {

        const whereConditions: any = {
            [Op.and]: [
                { '$comprobanteVenta.fecha$': { [Op.between]: [fechaInicio, fechaFin] } },
                { '$comprobanteVenta.estado$': 1 }
            ]
        };

        const kardex = await ComprobanteVentaDt.findAll({
            attributes: [
                [col('producto.codigo'), 'codigo'],
                [col('producto.descripcion'), 'descripcion'],
                [col('producto.codigoBarras'), 'codigoBarras'],
                [literal('CAST(SUM(cantidad) AS UNSIGNED)'), 'total']
            ],
            where: whereConditions,
            include: [
                {
                    model: ComprobanteVenta,
                    as: 'comprobanteVenta',
                    attributes: []
                },
                {
                    model: Producto,
                    as: 'producto',
                    attributes: []
                }
            ],
            group: [
                col('producto.codigo'),
                col('producto.descripcion'),
                col('producto.codigoBarras')
            ],
            order: [[fn('SUM', col('cantidad')), 'DESC']],
            raw: true
        });
        res.status(200).json({ status: true, value: kardex });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_TOTAL_PRODUCTOS', error);
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
            message: 'Comprobante no encontrado'
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
        const comprobanteDt = await ComprobanteVentaDt.findAll({ where: { idComprobanteVenta: id } });
        if (!comprobante) {
            await transaction.rollback();
            res.status(404).json({
                status: false,
                message: 'Comprobante no encontrado. Imposible anular.'
            });
            return;
        }

        comprobante.estado = false;
        await comprobante.save({ transaction });
        await ComprobanteVentaDt.update({ estado: false }, { where: { idComprobanteVenta: id }, transaction });

        const beneficiario = await Beneficiario.findByPk(comprobante.idBeneficiario);
        const documento = {
            idDocumento: comprobante.idComprobanteVenta,
            tipo: entidad,
            detalle: `Anulación Comprobante: ${beneficiario?.nombre}.`,
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
    getProductosDemandantes,
    getTotalProductos,
    getComprobanteVentaById,
    deleteComprobanteVenta
}