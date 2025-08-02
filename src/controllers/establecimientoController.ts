import { Request, Response } from 'express';
import { Establecimiento } from '../models/establecimientoModel';
import { handleHttp } from '../utils/handleError';
import { IEstablecimiento } from '../interfaces/IEstablecimiento';
import { registrarBitacora } from '../utils/bitacoraService';
import { Donante } from '../models/donanteModel';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';
import { Contador } from '../models/contadorModel';
import { limpiarTildes } from '../utils/utilsService';
import { Sector } from '../models/sectorModel';

const entidad = 'ESTABLECIMIENTO';

const createEstablecimiento = async (
    req: Request<{}, {}, Omit<IEstablecimiento, 'idEstablecimiento' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const establecimiento: Omit<IEstablecimiento, 'idEstablecimiento' | 'estado'> = req.body;
        const checkIs = await Establecimiento.findOne({
            where: { nombre: establecimiento.nombre, }
        });

        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'El establecimiento ya existe'
            });
            return;
        }

        establecimiento.codigo = await generarCodigo('establecimientos', transaction);
        const newEstablecimiento = await Establecimiento.create(establecimiento);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Establecimiento agregado exitosamente.',
            value: newEstablecimiento
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó el establecimiento ${establecimiento.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getEstablecimientos = async (req: Request, res: Response) => {
    try {
        const establecimientos = await Establecimiento.findAll({
            include: [{
                model: Donante,
                as: 'donante',
                attributes: ['nombre']
            }]
        });
        res.status(200).json({ value: establecimientos });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getEstablecimientoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const establecimiento = await Establecimiento.findByPk(id);
        if (!establecimiento) res.status(404).json({
            status: false,
            message: 'Establecimiento no encontrado'
        });
        else res.status(200).json({
            status: true,
            value: establecimiento
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const updateEstablecimiento = async (req: Request & { user?: any }, res: Response) => {
    try {
        const establecimiento: IEstablecimiento = req.body;
        const checkIs = await Establecimiento.findByPk(establecimiento.idEstablecimiento);
        if (!checkIs) res.status(404).json({
            status: false,
            message: 'Establecimiento no encontrado'
        });
        else {
            checkIs.nombre = establecimiento.nombre;
            checkIs.representanteLegal = establecimiento.representanteLegal;
            checkIs.idDonante = establecimiento.idDonante;
            checkIs.direccion = establecimiento.direccion;
            checkIs.direccionUrl = establecimiento.direccionUrl;
            checkIs.latitud = establecimiento.latitud;
            checkIs.longitud = establecimiento.longitud;
            checkIs.idSector = establecimiento.idSector;
            checkIs.nombreContacto = establecimiento.nombreContacto;
            checkIs.telefono = establecimiento.telefono;
            checkIs.correo = establecimiento.correo;
            await checkIs.save();
            await registrarBitacora(req, 'MODIFICACIÓN', entidad,
                `Se actualizó información del establecimiento ${establecimiento.nombre}.`)
            res.status(200).json({
                status: true,
                message: 'Datos de establecimiento actualizados exitosamente',
                value: checkIs
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const updateStatusEstablecimiento = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const establecimiento = await Establecimiento.findByPk(id);
        if (!establecimiento) res.status(404).json({
            status: false,
            message: 'Establecimiento no encontrado'
        });
        else {
            let status = true;
            if (establecimiento.estado) status = false;
            establecimiento.estado = status; // Marcar como anulado
            await establecimiento.save();
            await registrarBitacora(req, 'CAMBIO ESTADO', entidad, `Se cambió el estado del establecimiento ${establecimiento.nombre}.`);
            res.status(200).json({
                status: true,
                message: 'Estado de Establecimiento actualizado correctamente'
            });
        }
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

const importJson = async (
    req: Request<{}, {}, any[]>,
    res: Response
) => {
    const establecimientosExcel = req.body;

    const transaction = await sequelize.transaction();
    try {
        let contadorLocal = await Contador.findOne({
            where: { nombre: 'establecimientos' },
            transaction
        });

        if (!contadorLocal) {
            res.status(400).json({
                status: false,
                message: 'Contador no es válido.'
            });
            await transaction.rollback();
            return;
        }

        let siguienteValor = contadorLocal.ultimoValor;

        const donante = await Donante.findAll({ where: { estado: true } });
        const sectores = await Sector.findAll({ where: { estado: true } });

        const mapDonante = new Map(donante.map(t => [limpiarTildes(t.nombre), t.idDonante]));
        const mapSector = new Map(sectores.map(s => [limpiarTildes(s.nombre), s.idSector]));

        for (const row of establecimientosExcel) {
            const identificacion = row.ruc?.trim();

            const idDonante = mapDonante.get(limpiarTildes(row.donante));
            const idSector = mapSector.get(limpiarTildes(row.sector));

            if (!idDonante) {
                res.status(400).json({
                    status: false,
                    message: `El donante ${row.tipoOrganizacion} no es válido o no esta registrado.`
                });
                await transaction.rollback();
                return;
            };

            if (!idSector) {
                res.status(400).json({
                    status: false,
                    message: `El sector ${row.sector} no es válido o no esta registrado.`
                });
                await transaction.rollback();
                return;
            };

            siguienteValor += 1;
            const codigo = `${contadorLocal.prefijo}${siguienteValor.toString().padStart(contadorLocal.numFormato, '0')}`;
            const nueva = await Establecimiento.create({
                codigo,
                nombre: row.nombre.toUpperCase().trim(),
                idDonante: idDonante,
                identificacion: row.identificacion?.trim() ? row.identificacion.trim() : null,
                representanteLegal: row.representanteLegal?.trim() ? row.representanteLegal.trim() : null,
                direccion: row.direccion.trim(),
                direccionUrl: (row.direccionUrl?.trim().substring(0, 300)) || '',
                latitud: Number(row.latitud),
                longitud: Number(row.longitud),
                idSector,
                nombreContacto: row.nombreContacto.trim() || '',
                telefono: typeof row.telefono === 'string' ? row.telefono.trim() : String(row.telefono || '').trim(),
                correo: row.correo.trim(),
                estado: true
            }, { transaction });
        }
        contadorLocal.ultimoValor = siguienteValor;
        await contadorLocal.save({ transaction });

        await transaction.commit();
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se importó los establecimientos desde Excel`);

        res.status(201).json({
            status: true,
            message: 'Proceso de importación finalizado',
        });

    } catch (error) {
        await transaction.rollback();
        console.log(res);
        return handleHttp(res, 'ERROR_POST', error);
    }
};

export {
    createEstablecimiento,
    getEstablecimientos,
    getEstablecimientoById,
    updateEstablecimiento,
    updateStatusEstablecimiento as deleteEstablecimiento,
    importJson
}