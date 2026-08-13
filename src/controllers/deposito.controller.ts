import { Request, Response } from 'express';
import { registrarBitacora } from "../utils/bitacoraService";
import { handleHttp } from '../utils/handleError';
import { FilterDto } from '../dtos/filter.dto';
import { DepositoService } from '../services/deposito.service';
import { IDeposito } from '../interfaces/deposito.interface';
import { deleteFileFromStorage, saveFileToStorage } from '../helpers/file-upload.helper';
import { Deposito } from '../models/deposito.model';
import * as fs from 'fs';
import * as path from 'path';

const service = new DepositoService();
const entidad = 'DEPOSITO';

export const create = async (
    req: Request<{}, {}, IDeposito & { papeletaBase64?: string; papeletaNombre?: string }> & { user?: any },
    res: Response
) => {
    const data: IDeposito = req.body;
    let rutaPapeleta = req.body.rutaPapeleta || '';
    try {
        const usuarioId = req.user.idUsuario;
        data.creadorId = usuarioId;

        if (req.body.papeletaBase64 && req.body.papeletaNombre) {
            rutaPapeleta = saveFileToStorage({
                base64OrBuffer: req.body.papeletaBase64,
                fileNameOriginal: req.body.papeletaNombre,
                fileNameActual: data.numeroPapeleta,
                folderName: 'depositos'
            });
        }
        data.rutaPapeleta = rutaPapeleta;

        const newDeposito: Deposito = await service.createDeposito(data);
        res.status(201).json({
            status: true,
            message: 'Depósito creado exitosamente.',
            value: newDeposito
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el depósito ${data.id}.`);
    } catch (error) {
        if (rutaPapeleta) {
            deleteFileFromStorage(rutaPapeleta);
        }

        if (error instanceof Error) {
            if (error.message === 'DT_EMPTY') {
                res.status(400).json({
                    status: false,
                    message: 'No se ha especificado el detalle de valores.'
                });
                return;
            }

            if (error.message === 'INGRESO_DT_ERROR') {
                res.status(400).json({
                    status: false,
                    message: 'IngresoDt no válido.'
                });
                return;
            }

            if (error.message === 'DEPOSITO_SUPERA_VALOR') {
                res.status(400).json({
                    status: false,
                    message: 'El valor del depósito supera al registrado.'
                });
                return;
            }

            return handleHttp(res, `ERROR_POST_${entidad}`, error);
        } else {
            return handleHttp(res, `ERROR_POST_${entidad}_UNKNOWN`, String(error));
        }
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const depositos = await service.getAll();
        res.status(200).json({ value: depositos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_DEPOSITOS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const idNum = parseInt(id as string);
    try {
        if (isNaN(idNum)) {
            res.status(400).json({
                status: false,
                message: "DepositoId inválido."
            });
            return;
        }

        const deposito = await service.getDepositoById(idNum);
        if (!deposito) {
            res.status(404).json({
                status: false,
                message: 'Depósito no encontrada/o'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: deposito
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};

export const getDepositosByDateAndBancoId = async (
    req: Request<{}, {}, FilterDto>,
    res: Response
) => {
    const filters: FilterDto = req.body;

    if (!filters.fechaInicio || !filters.fechaFin) {
        res.status(400).json({
            status: false,
            message: 'Se requieren fechaInicio y fechaFin para la consulta.'
        });
        return;
    }

    try {
        const depositos = await service.getDepositosByDateAndBancoIdAsync(filters);

        res.status(200).json({
            status: true,
            value: depositos
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_${entidad}`, error);
    }
};

export const getIngresosForDeposito = async (
    req: Request<{}, {}, FilterDto>,
    res: Response
) => {
    const filters: FilterDto = req.body;
    try {
        const cajaBancoId = filters.cajaBancoId;
        const ingresos = await service.getIngresosForDepositoAsync(cajaBancoId);

        res.status(200).json({
            status: true,
            value: ingresos
        });
    } catch (error) {
        return handleHttp(res, `ERROR_GET_INGRESOS_FOR_${entidad}`, error);
    }
};

export const getPapeleta = async (req: Request, res: Response) => {
    try {
        const { ruta } = req.query;

        if (!ruta || typeof ruta !== 'string') {
            res.status(400).json({ status: false, message: 'Ruta no especificada.' });
            return;
        }

        const baseUploadDir = process.env.UPLOAD_DIR || './uploads';
        const fullFilePath = path.join(baseUploadDir, ruta);

        if (!fs.existsSync(fullFilePath)) {
            res.status(404).json({ status: false, message: 'El archivo no existe en el servidor.' });
            return;
        }

        res.sendFile(path.resolve(fullFilePath));
    } catch (error) {
        return handleHttp(res, 'ERROR_GET_ADJUNTO', error);
    }
};