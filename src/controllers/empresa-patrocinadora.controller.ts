import { Request, Response } from 'express';
import { registrarBitacora } from '../utils/bitacoraService';
import { handleHttp } from '../utils/handleError';
import { EmpresaPatrocinadoraService } from '../services/empresa-patrocinadora.service';
import { IEmpresaPatrocinadora } from '../interfaces/empresa-patrocinadora.interface';
import { EmpresaPatrocinadora } from '../models/empresa-patrocinadora.model';
import { EmpresaPatrocinadoraBeneficiario } from '../models/empresa-patrocinadora-beneficiario.model';
import { Beneficiario } from '../models/beneficiarioModel';

const service = new EmpresaPatrocinadoraService();
const entidad = 'EMPRESA_PATROCINADORA';

export const create = async (
    req: Request<{}, {}, IEmpresaPatrocinadora> & { user?: any },
    res: Response
) => {
    const empresaPatrocinadoraData: IEmpresaPatrocinadora = req.body;
    try {
        const newEmpresaPatrocinadora: EmpresaPatrocinadora = await service.createEmpresaPatrocinadora(empresaPatrocinadoraData);
        res.status(201).json({
            status: true,
            message: 'Empresa agregada exitosamente.',
            value: newEmpresaPatrocinadora
        });
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó la empresa ${empresaPatrocinadoraData.nombre}.`);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'ENTIDAD_EXISTE') {
                res.status(400).json({
                    status: false,
                    message: 'Empresa ya existe.'
                });
                return;
            }

            if (error.message === 'RUC_EXISTE') {
                res.status(404).json({
                    status: false,
                    message: 'Ya existe una empresa con el ruc especificado.'
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
    req: Request<{}, {}, IEmpresaPatrocinadora> & { user?: any },
    res: Response
) => {
    const empresaPatrocinadoraData: IEmpresaPatrocinadora = req.body;
    try {
        const updatedEmpresaPatrocinadora = await service.updateEmpresaPatrocinadora(empresaPatrocinadoraData);
        res.status(200).json({
            status: true,
            message: 'Datos actualizados exitosamente',
            value: updatedEmpresaPatrocinadora
        });

        await registrarBitacora(req, 'MODIFICACIÓN', entidad, `Se actualizó información de la empresa ${updatedEmpresaPatrocinadora.nombre}.`);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Empresa no encontrada.'
            });
            return;
        }

        if (errorMessage === 'NOMBRE_DE_ENTIDAD_EXISTE') {
            res.status(400).json({
                status: false,
                message: 'El nombre de EmpresaPatrocinadora ya existe.'
            });
            return;
        }

        if (errorMessage === 'RUC_EXISTE') {
            res.status(404).json({
                status: false,
                message: 'Ya existe una empresa con el ruc especificado.'
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
        const updatedEmpresaPatrocinadora = await service.updateEmpresaPatrocinadoraStatus(id);
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió estado de la empresa ${updatedEmpresaPatrocinadora.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado de la empresa actualizado correctamente',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage === 'ENTIDAD_NO_ENCONTRADA') {
            res.status(404).json({
                status: false,
                message: 'Empresa no encontrada. Imposible cambiar de estado.'
            });
            return;
        }
        return handleHttp(res, 'ERROR_UPDATE_STATUS', error);
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const empresasPatrocinadoras = await service.getAll({
            include: [
                {
                    model: EmpresaPatrocinadoraBeneficiario,
                    as: 'beneficiarios',
                    attributes: ['id', 'beneficiarioId'],
                    where: { anulado: false },
                    required: false,
                    include: [
                        {
                            model: Beneficiario,
                            as: 'beneficiario',
                            attributes: ['nombre']
                        }
                    ]
                }
            ]
        });

        res.status(200).json({ value: empresasPatrocinadoras });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL_EMPRESAS', error);
    }
};

export const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const empresaPatrocinadora = await service.getById(id);
        if (!empresaPatrocinadora) {
            res.status(404).json({
                status: false,
                message: 'Empresa no encontrada'
            });
            return;
        }
        res.status(200).json({
            status: true,
            value: empresaPatrocinadora
        });
    } catch (error) {
        handleHttp(res, `ERROR_GET_BY_ID_${entidad}`, error);
    }
};