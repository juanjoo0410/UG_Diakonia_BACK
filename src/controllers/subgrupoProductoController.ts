import { Request, Response } from 'express';
import { SubgrupoProducto } from '../models/subgrupoProductoModel';
import { handleHttp } from '../utils/handleError';
import { ISubgrupoProducto } from '../interfaces/ISubgrupoProducto';
import { registrarBitacora } from '../utils/bitacoraService';
import { Beneficiario } from '../models/beneficiarioModel';

const entidad = 'SUBGRUPO_PRODUCTO';

const createSubgrupoProducto = async (
    req: Request<{}, {}, Omit<ISubgrupoProducto, 'idSubgrupoProducto' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const subgrupoProducto: Omit<ISubgrupoProducto, 'idSubgrupoProducto' | 'estado'> = req.body;
        const checkIs = await SubgrupoProducto.findOne({
            where: { nombre: subgrupoProducto.nombre, }
        });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'El subgrupo de producto ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creó el grupo de producto ${subgrupoProducto.nombre}.`)
            const newSubgrupoProducto = await SubgrupoProducto.create(subgrupoProducto);
            res.status(201).json({
                status: true,
                message: 'Subgrupo de producto agregado exitosamente.',
                data: newSubgrupoProducto
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getSubgruposProducto = async (req: Request, res: Response) => {
    try {
        const subgruposProducto = await SubgrupoProducto.findAll({ where: { estado: true } });
        res.status(200).json({ value: subgruposProducto });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getSubgrupoProductoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const subgrupoProducto = await SubgrupoProducto.findByPk(id);
        if (!subgrupoProducto) res.status(404).json({
            status: false,
            message: 'Subgrupo de producto no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: subgrupoProducto
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateSubgrupoProducto = async (req: Request & { user?: any }, res: Response) => {
    try {
        const subgrupoProducto: ISubgrupoProducto = req.body;
        const checkIs = await SubgrupoProducto.findByPk(subgrupoProducto.idSubgrupoProducto);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Subgrupo de producto no encontrado'
            });
            return;
        }

        if (subgrupoProducto.nombre != checkIs.nombre) {
            const nameExist = await SubgrupoProducto.findOne({ where: { nombre: subgrupoProducto.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nomnre del subgrupo de producto ya existe'
                });
                return;
            }
        }
        checkIs.codigo = subgrupoProducto.codigo;
        checkIs.nombre = subgrupoProducto.nombre;
        checkIs.idGrupoProducto = subgrupoProducto.idGrupoProducto;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información del subgrupo de producto ${subgrupoProducto.nombre}.`)
        res.status(200).json({
            status: true,
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const deleteSubgrupoProducto = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const subgrupoProducto = await SubgrupoProducto.findByPk(id);
        if (!subgrupoProducto) {
            res.status(404).json({
                status: false,
                message: 'Subgrupo de producto no encontrado'
            });
            return;
        }
        subgrupoProducto.estado = false; // Marcar como anulado
        await subgrupoProducto.save();
        await registrarBitacora(req, 'ELIMINACIÓN', entidad,
            `Se eliminó el subgrupo de producto ${subgrupoProducto.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Subgrupo de producto eliminado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

export {
    createSubgrupoProducto,
    getSubgruposProducto,
    getSubgrupoProductoById,
    updateSubgrupoProducto,
    deleteSubgrupoProducto
}