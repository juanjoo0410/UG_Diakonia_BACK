import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { IIngreso } from '../interfaces/IIngreso';
import sequelize from "../config/db";
import { Ingreso } from '../models/ingresoModel';
import { IngresoDt } from '../models/ingresoDtModel';
import { IIngresoDt } from '../interfaces/IIngresoDt';
import { actualizarStock } from '../utils/stockService';
import { agregarKardex } from '../utils/kardexService';

const entidad = 'INGRESO';

const createIngreso = async (
    req: Request<{}, {}, Omit<IIngreso, 'idIngreso' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const ingreso: Omit<IIngreso, 'idIngreso' | 'estado'> = req.body;
        if (!ingreso.ingresoDt ||
            !Array.isArray(ingreso.ingresoDt) ||
            ingreso.ingresoDt.length === 0) {
            res.status(400).json({
                status: false,
                message: "Detalle del ingreso es requerido"
            });
            return;
        }
        const newIngreso = await Ingreso.create(
            {
                idTipoTransaccion: ingreso.idTipoTransaccion,
                descripcion: ingreso.descripcion,
                idDonante: ingreso.idDonante ?? 0,
                totalPeso: ingreso.totalPeso,
            },
            { transaction }
        );
        const detalles = ingreso.ingresoDt.map((
            detalle: Omit<IIngresoDt, 'idIngresoDt' | 'estado'>) => ({
                idIngreso: newIngreso.idIngreso ?? 0,
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            }));
        const documento = {
            idDocumento: newIngreso.idIngreso,
            tipo: entidad,
            detalle: newIngreso.descripcion,
            esIngreso: true
        }
        await IngresoDt.bulkCreate(detalles, { transaction });
        await actualizarStock(detalles, true, transaction);
        await agregarKardex(documento, detalles, transaction);
        await transaction.commit();
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el ingreso ${newIngreso.idIngreso}.`);
        res.status(201).json({
            status: true,
            message: 'Rol creado con éxito',
            value: newIngreso
        });
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getIngresos = async (req: Request, res: Response) => {
    try {
        const ingreso = await Ingreso.findAll({ where: { estado: true } });
        res.status(200).json({ value: ingreso });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getIngresoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ingreso = await Ingreso.findOne({
            where: { idIngreso: id },
            include: [
                {
                    model: IngresoDt, // Relación con el modelo de detalles
                    as: "ingDetalles", // Alias definido en las asociaciones
                }
            ],
        });
        if (!ingreso) res.status(404).json({
            status: false,
            message: 'Ingreso no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: ingreso
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

export {
    createIngreso,
    getIngresos,
    getIngresoById
}