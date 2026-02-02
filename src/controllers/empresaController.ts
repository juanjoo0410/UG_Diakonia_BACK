import { Request, Response } from 'express';
import { Empresa } from '../models/empresaModel';
import { handleHttp } from '../utils/handleError';
import { IEmpresa } from '../interfaces/IEmpresa';
import { registrarBitacora } from '../utils/bitacoraService';

const entidad = 'EMPRESA';

const getEmpresa = async (
    req: Request,
    res: Response) => {
    try {
        const empresa = await Empresa.findOne({ where: { estado: true } });
        if (!empresa) res.status(404).json({
            status: false,
            message: 'Empresa no encontrada'
        });
        else res.status(200).json({
            status: true,
            value: empresa
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const createEmpresa = async (
    req: Request<{}, {}, Omit<IEmpresa, 'idEmpresa' | 'estado'>> & { user?: any },
    res: Response) => {
    try {
        const empresa: Omit<IEmpresa, 'idEmpresa' | 'estado'> = req.body;
        const checkIs = await Empresa.findOne({ where: { ruc: empresa.ruc } });
        if (checkIs) {
            res.status(400).json({
                status: false,
                message: 'Ruc de empresa ya existe'
            });
        } else {
            await registrarBitacora(req, 'CREACIÓN', entidad,
                `Se creo la empresa ${empresa.razonSocial}.`)
            const newEmpresa = await Empresa.create(empresa);
            res.status(201).json({
                status: true,
                message: 'Empresa registrada exitosamente.',
                value: newEmpresa
            });
        }
    } catch (error) {
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const updateEmpresa = async (
    req: Request,
    res: Response) => {
    try {
        const empresa: IEmpresa = req.body;
        const checkIs = await Empresa.findByPk(empresa.idEmpresa);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Empresa no encontrada'
        });
        else {
            checkIs.ruc = empresa.ruc;
            checkIs.razonSocial = empresa.razonSocial;
            checkIs.representanteLegal = empresa.representanteLegal;
            checkIs.direccion = empresa.direccion;
            checkIs.telefono = empresa.telefono;
            checkIs.direccionUrl = empresa.direccionUrl;
            checkIs.latitud = empresa.latitud;
            checkIs.longitud = empresa.longitud;            
            checkIs.rutaLogo = empresa.rutaLogo;
            checkIs.obligadoContabilidad = empresa.obligadoContabilidad;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información de la empresa ${empresa.razonSocial}.`)
            res.status(200).json({
                status: true,
                message: 'Datos de empresa actualizados exitosamente.',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

export {
    createEmpresa,
    updateEmpresa,
    getEmpresa
}