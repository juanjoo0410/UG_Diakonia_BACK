import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { Institucion } from '../models/institucionModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';
import { ISector } from '../interfaces/ISector';
import { Sector } from '../models/sectorModel';

const entidad = 'SECTOR';

const create = async (
    req: Request<{}, {}, Omit<ISector, 'idSector' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const sector: Omit<ISector, 'idSector' | 'estado'> = req.body;
        const checkIs = await Sector.findOne({
            where: { nombre: sector.nombre, }
        });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El sector ya existe'
            });
            return;
        }
        sector.codigo = await generarCodigo('sectores', transaction);
        const newSector = await Sector.create(sector);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Sector agregado exitosamente.',
            value: newSector
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el sector ${sector.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const sector = await Sector.findAll();
        res.status(200).json({ value: sector });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const sector = await Sector.findByPk(id);
        if (!sector) res.status(404).json({
            status: false,
            message: 'Sector no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: sector
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const update = async (req: Request & { user?: any }, res: Response) => {
    try {
        const sector: Sector = req.body;
        const checkIs = await Sector.findByPk(sector.idSector);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Sector no encontrado'
            });
            return;
        }

        if (sector.nombre.toLocaleUpperCase() != 
        checkIs.nombre.toLocaleUpperCase()) {
            const nameExist = await Sector.findOne({ where: { nombre: sector.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del Sector ya existe'
                });
                return;
            }
        }
        checkIs.codigo = sector.codigo;
        checkIs.nombre = sector.nombre;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del sector ${sector.nombre}.`)
        res.status(200).json({
            status: true,
            message: 'Datos de sector actualizados exitosamente',
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const updateStatus = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const sector = await Sector.findByPk(id);
        if (!sector) {
            res.status(404).json({
                status: false,
                message: 'Sector no encontrado'
            });
            return;
        }
        let status = true;
        if (sector.estado) {
            status = false;
            const institucion = await Institucion.findOne({ where: { estado: true, idSector: sector.idSector } });
            if (institucion) {
                res.status(404).json({
                    status: false,
                    message: 'Existen instituciones asignadas a este sector. Imposible desactivar.'
                });
                return;
            }
        }
        
        sector.estado = status;
        await sector.save();
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad, `Se cambió el estado del sector ${sector.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del Sector actualizado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    create,
    getAll,
    getById,
    update,
    updateStatus
}