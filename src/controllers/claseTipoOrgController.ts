import { Request, Response } from 'express';
import { ClaseTipoOrg } from '../models/claseTipoOrgModel';
import { handleHttp } from '../utils/handleError';
import { IClaseTipoOrg } from '../interfaces/IClaseTipoOrg';
import { registrarBitacora } from '../utils/bitacoraService';
import { TipoOrg } from '../models/tipoOrgModel';

const entidad = 'CLASE_TIPO_ORG';

const createClaseTipoOrg = async (
    req: Request<{}, {}, Omit<IClaseTipoOrg, 'idClaseTipoOrg' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const claseTipoOrg: Omit<IClaseTipoOrg, 'idClaseTipoOrg' | 'estado'> = req.body;
        const checkIs = await ClaseTipoOrg.findOne({ where: { nombre: claseTipoOrg.nombre } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'La clase de tipo de organizacion ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó la clase ${claseTipoOrg.nombre}.`)
            const newClase = await ClaseTipoOrg.create(claseTipoOrg);
            res.status(201).json({
                status: true,
                message: 'Clase agregada exitosamente.',
                data: newClase
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getClasesTipoOrg = async (req: Request, res: Response) => {
    try {
        const claseTipoOrg = await ClaseTipoOrg.findAll({ where: { estado: true } });
        res.status(200).json({ value: claseTipoOrg });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getClaseTipoOrgById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const claseTipoOrg = await ClaseTipoOrg.findByPk(id);
        if (!claseTipoOrg) res.status(404).json({
            status: false,
            message: 'Clase no encontrada'
        });
        else res.status(200).json({
            status: true,
            value: claseTipoOrg
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateClaseTipoOrg = async (req: Request & { user?: any }, res: Response) => {
    try {
        const claseTipoOrg: IClaseTipoOrg = req.body;
        const checkIs = await ClaseTipoOrg.findByPk(claseTipoOrg.idClaseTipoOrg);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Clase no encontrada'
        });
        else {
            checkIs.nombre = claseTipoOrg.nombre;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información de la clase ${claseTipoOrg.nombre}.`)
            res.status(200).json({
                status: true,
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteClaseTipoOrg = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const claseTipoOrg = await ClaseTipoOrg.findByPk(id);
        if (!claseTipoOrg) {
            res.status(404).json({
                status: false,
                message: 'Clase no encontrada. Imposible eliminar.'
            });
            return;
        }
        const tipoOrg = await TipoOrg.findOne({ where: { idClaseTipoOrg: claseTipoOrg.idClaseTipoOrg } });
        if (tipoOrg) {
            res.status(404).json({
                status: false,
                message: 'Existen tipos de organizaciones asignados a esta clase. Imposible eliminar.'
            });
            return;
        }
        claseTipoOrg.estado = false; // Marcar como anulado
        await claseTipoOrg.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó la clase ${claseTipoOrg.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Clase eliminada correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createClaseTipoOrg,
    getClasesTipoOrg,
    getClaseTipoOrgById,
    updateClaseTipoOrg,
    deleteClaseTipoOrg
}