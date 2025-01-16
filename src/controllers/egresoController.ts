import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import sequelize from "../config/db";
import { IEgreso } from '../interfaces/IEgreso';
import { Egreso } from '../models/egresoModel';
import { IEgresoDt } from '../interfaces/IEgresoDt';
import { EgresoDt } from '../models/egresoDtModel';
import { actualizarStock } from '../utils/stockService';
import { agregarKardex } from '../utils/kardexService';
import { Op } from 'sequelize';
import { TipoTransaccion } from '../models/tipoTransaccionModel';
import { Beneficiario } from '../models/beneficiarioModel';

const entidad = 'EGRESO';

const createEgreso = async (
    req: Request<{}, {}, Omit<IEgreso, 'idEgreso' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const egreso: Omit<IEgreso, 'idEgreso' | 'estado'> = req.body;
        if (!egreso.egresoDt ||
            !Array.isArray(egreso.egresoDt) ||
            egreso.egresoDt.length === 0) {
            res.status(400).json({
                status: false,
                message: "Detalle del egreso es requerido"
            });
            return;
        }
        const newEgreso = await Egreso.create(
            {
                idTipoTransaccion: egreso.idTipoTransaccion,
                descripcion: egreso.descripcion,
                idBeneficiario: egreso.idBeneficiario ?? 0,
                totalPeso: egreso.totalPeso,
                usuario: egreso.usuario
            },
            { transaction }
        );
        const detalles = egreso.egresoDt.map((
            detalle: Omit<IEgresoDt, 'idEgresoDt' | 'estado'>) => ({
                idEgreso: newEgreso.idEgreso ?? 0,
                idProducto: detalle.idProducto,
                idBodega: detalle.idBodega,
                idUbicacion: detalle.idUbicacion,
                cantidad: detalle.cantidad,
                peso: detalle.peso
            }));
        const documento = {
            idDocumento: newEgreso.idEgreso,
            tipo: entidad,
            detalle: newEgreso.descripcion,
            esIngreso: false
        }
        await EgresoDt.bulkCreate(detalles, { transaction });
        await actualizarStock(detalles, false, transaction);
        await agregarKardex(documento, detalles, transaction);
        await transaction.commit();
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el egreso ${newEgreso.idEgreso}.`);
        res.status(201).json({
            status: true,
            message: 'Egreso realizado con éxito',
            value: newEgreso
        });
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getEgresos = async (req: Request, res: Response) => {
    const { fechaInicio, fechaFin } = req.body;
    try {
        const egreso = await Egreso.findAll({
            where: {
                estado: true,
                fecha: {
                    [Op.between]: [fechaInicio, fechaFin], // Filtrar entre las fechas
                },
            },
            include: [{
                model: TipoTransaccion,
                as: 'tipoTransaccion',
                attributes: ['nombre']
            }]
        });
        res.status(200).json({ status: true, value: egreso });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getEgresoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const egreso = await Egreso.findOne({
            where: { idEgreso: id },
            include: [
                {
                    model: EgresoDt,
                    as: "egDetalles",
                }
            ],
        });
        if (!egreso) res.status(404).json({
            status: false,
            message: 'Egreso no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: egreso
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

export {
    createEgreso,
    getEgresos,
    getEgresoById
}