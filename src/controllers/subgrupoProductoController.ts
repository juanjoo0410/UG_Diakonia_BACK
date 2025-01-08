import { Request, Response } from 'express';
import { SubgrupoProducto } from '../models/subgrupoProductoModel';
import { handleHttp } from '../utils/handleError';
import { ISubgrupoProducto } from '../interfaces/ISubgrupoProducto';
import { registrarBitacora } from '../utils/bitacoraService';
import { Producto } from '../models/productoModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';
import { GrupoProducto } from '../models/grupoProductoModel';

const entidad = 'SUBGRUPO_PRODUCTO';

const createSubgrupoProducto = async (
    req: Request<{}, {}, Omit<ISubgrupoProducto, 'idSubgrupoProducto' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const subgrupoProducto: Omit<ISubgrupoProducto, 'idSubgrupoProducto' | 'estado'> = req.body;
        const checkIs = await SubgrupoProducto.findOne({
            where: { nombre: subgrupoProducto.nombre, }
        });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El subgrupo de producto ya existe'
            });
            return;
        }
        subgrupoProducto.codigo = await generarCodigo('subgruposProducto', transaction);
        const newSubgrupoProducto = await SubgrupoProducto.create(subgrupoProducto, { transaction });
        await transaction.commit();
        res.status(201).json({
            status: true,
            message:
                `Subgrupo de producto con codigo ${newSubgrupoProducto.codigo} agregado exitosamente.`,
            value: newSubgrupoProducto
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el grupo de producto ${subgrupoProducto.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getSubgruposProducto = async (req: Request, res: Response) => {
    try {
        const subgruposProducto = await SubgrupoProducto.findAll({
            where: { estado: true },
            include: [{
                model: GrupoProducto,
                as: 'grupoProducto',
                attributes: ['nombre']
            }]
        });
        res.status(200).json({ value: subgruposProducto });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getSubgruposByIdGrupo = async (req: Request, res: Response) => {
    const { idGrupo } = req.params;
    try {
        const subgrupos = await SubgrupoProducto.findAll({
            where: { idGrupoProducto: idGrupo },
            order: [['nombre', 'ASC']]
        });
        res.status(200).json({
            status: true,
            value: subgrupos
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_IDMENU', error);
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
            message: 'Datos de subgrupo actualizados exitosamente',
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
        const producto = await Producto.findOne({ where: { idSubgrupoProducto: subgrupoProducto.idSubgrupoProducto } });
        if (producto) {
            res.status(404).json({
                status: false,
                message: 'Existen productos asignados a este subgrupo. Imposible eliminar.'
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
    getSubgruposByIdGrupo,
    getSubgrupoProductoById,
    updateSubgrupoProducto,
    deleteSubgrupoProducto
}