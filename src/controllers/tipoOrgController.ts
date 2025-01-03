import { Request, Response } from 'express';
import { TipoOrg } from '../models/tipoOrgModel';
import { handleHttp } from '../utils/handleError';
import { ITipoOrg } from '../interfaces/ITipoOrg';
import { registrarBitacora } from '../utils/bitacoraService';

const entidad = 'TIPO_ORGANIZACION';

const createTipoORg = async (
    req: Request<{}, {}, Omit<ITipoOrg, 'idTipoOrg' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const tipoOrg: Omit<ITipoOrg, 'idTipoOrg' | 'estado'> = req.body;
        const checkIs = await TipoOrg.findOne({
            where: { nombre: tipoOrg.nombre, }
        });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El tipo de organización ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó el tipo de organización ${tipoOrg.nombre}.`)
            const newTipoOrg = await TipoOrg.create(tipoOrg);
            res.status(201).json({
                status: true,
                message: 'Tipo de organización agregado exitosamente.',
                data: newTipoOrg
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getTiposOrg = async (req: Request, res: Response) => {
    try {
        const tiposOrg = await TipoOrg.findAll({ where: { estado: true } });
        res.status(200).json({ value: tiposOrg });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTipoOrgById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tipoOrg = await TipoOrg.findByPk(id);
        if (!tipoOrg) res.status(404).json({
            status: false,
            message: 'Tipo de organización no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: tipoOrg
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateTipoOrg = async (req: Request & { user?: any }, res: Response) => {
    try {
        const tipoOrg: ITipoOrg = req.body;
        const checkIs = await TipoOrg.findByPk(tipoOrg.idTipoOrg);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Tipo de organización no encontrado'
            });
            return;
        }

        if (tipoOrg.nombre != checkIs.nombre){
            const nameExist = await TipoOrg.findOne({where : {nombre: tipoOrg.nombre}});
            if(nameExist){
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del Tipo de organización ya existe'
                });
                return; 
            }
        }
        checkIs.codigo = tipoOrg.codigo;
        checkIs.nombre = tipoOrg.nombre;
        checkIs.idClaseTipoOrg = tipoOrg.idClaseTipoOrg;
        checkIs.descripcion = tipoOrg.descripcion;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del tipo de organización ${tipoOrg.nombre}.`)
        res.status(200).json({
            status: true,
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteTipoOrg = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const tipoOrg = await TipoOrg.findByPk(id);
        if (!tipoOrg) res.status(404).json({
            status: false,
            message: 'Tipo de organización no encontrado'
        });
        else {
            tipoOrg.estado = false; // Marcar como anulado
            await tipoOrg.save();
            await registrarBitacora(req, 'ELIMINACIÓN', entidad, `Se eliminó el tipo de organización ${tipoOrg.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Tipo de organización eliminado correctamente'
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createTipoORg,
    getTiposOrg,
    getTipoOrgById,
    updateTipoOrg,
    deleteTipoOrg
}