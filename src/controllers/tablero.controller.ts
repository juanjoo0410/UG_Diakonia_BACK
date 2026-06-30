import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import { registrarBitacora } from '../utils/bitacoraService';
import { AreaService } from '../services/area.service';
import { Area } from '../models/Area.model';
import { IArea } from '../interfaces/area.interface';
import { TableroService } from '../services/tablero.service';
import { ITablero } from '../interfaces/tablero.interface';
import { Tablero } from '../models/tablero.model';
import { Usuario } from '../models/usuarioModel';
import { TableroUsuario } from '../models/tablero-usuario.model';

const service = new TableroService();
const entidad = 'TABLERO';

export const create = async (
    req: Request<{}, {}, ITablero> & { user?: any },
    res: Response
) => {
    const data: ITablero = req.body;
    try {
        const newTablero: Tablero = await service.createTablero(data);
        res.status(201).json({
            status: true,
            message: 'Tablero agregado exitosamente.',
            value: newTablero
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el tablero ${data.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Tablero ya existe.'
                });
                return;
            }
            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const update = async (
    req: Request<{}, {}, ITablero> & { user?: any },
    res: Response
) => {
    const data: ITablero = req.body;
    try {
        const updatedTablero = await service.updateTablero(data);
        res.status(200).json({
            status: true,
            message: 'Datos de tablero actualizados exitosamente',
            value: updatedTablero
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información del tablero ${updatedTablero.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Tablero no encontrado.'
            });
            return;
        }

        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre del Tablero ya existe.'
            });
            return;
        }

        return handleHttp(res, `ERROR_PUT_${entidad}`, error);
    }
};

export const updateStatus = async (
    req: Request<{ id: string }> & { user?: any },
    res: Response
) => {
    const id = req.params.id;
    try {
        const updatedTablero = await service.updateTableroStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado del área ${updatedTablero.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado del Tablero actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Tablero no encontrado. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const tableros = await service.getAll({
            include: [{
                model: TableroUsuario,
                as: 'tablerosUsuarios',
                include: [{
                    model: Usuario,
                    as: 'usuarios',
                    attributes: ['nombre','codigo']
                }]
            }],
        });

        const mappedTableros = tableros.map((tablero: any) => {
            return {
                ...tablero.toJSON(),
                tablerosUsuarios: tablero.tablerosUsuarios.map((pivotRecord: any) => ({
                    id: pivotRecord.id,
                    idTablero: pivotRecord.idTablero,
                    idUsuario: pivotRecord.idUsuario,
                    codigoUsuario: pivotRecord.usuarios?.codigo || '0000000000',
                    nombreUsuario: pivotRecord.usuarios?.nombre || 'Desconocido'
                }))
            };
        });

        res.status(200).json({ value: mappedTableros });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_TABLEROS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tablero = await service.getById(id);
        if (!tablero) {
            res.status(404).json({
                status: false,
                message: 'Tablero no encontrado'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: tablero
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};