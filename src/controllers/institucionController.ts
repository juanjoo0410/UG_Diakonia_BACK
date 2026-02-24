import { Request, Response } from 'express';
import { Institucion } from '../models/institucionModel';
import { handleHttp } from '../utils/handleError';
import { IInstitucion } from '../interfaces/IInstitucion';
import { registrarBitacora } from '../utils/bitacoraService';
import { Op } from 'sequelize';
import sequelize from '../config/db';
import { generarCodigo } from '../utils/contadorService';
import { TipoOrg } from '../models/tipoOrgModel';
import { TipoPoblacion } from '../models/tipoPoblacionModel';
import { Clasificacion } from '../models/clasificacionModel';
import { Sector } from '../models/sectorModel';
import { limpiarTildes, normalizarFecha } from '../utils/utilsService';
import { Contador } from '../models/contadorModel';

const entidad = 'INSTITUCIÓN';

const create = async (
    req: Request<{}, {}, Omit<IInstitucion, 'idInstitucion' | 'estado'>> & { user?: any },
    res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const institucion: Omit<IInstitucion, 'idInstitucion' | 'estado'> = req.body;
        const checkIs = await Institucion.findOne({
            where: {
                [Op.or]: [
                    { identificacion: institucion.identificacion },
                    { nombre: { [Op.like]: `%${institucion.nombre}%` } },
                ],
            }
        });
        if (checkIs) {
            await transaction.rollback();
            res.status(400).json({
                status: false,
                message: 'La Identificación/Ruc o el nombre de la institución ya existen en la base datos.'
            });
            return;
        }
        institucion.codigo = await generarCodigo('instituciones', transaction);
        const newInstitucion = await Institucion.create(institucion);
        await transaction.commit();
        res.status(201).json({
            status: true,
            message: 'Institución agregada exitosamente.',
            value: newInstitucion
        });
        await registrarBitacora(req, 'CREACIÓN', entidad,
            `Se creó la institución ${institucion.nombre}.`);
    } catch (error) {
        await transaction.rollback();
        return handleHttp(res, 'ERROR_POST', error);
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const instituciones = await Institucion.findAll();
        res.status(200).json({ value: instituciones });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotal = async (req: Request, res: Response) => {
    try {
        const totalInstituciones = await Institucion.count({
            where: {
                estado: true,
            },
        });
        res.status(200).json({ status: true, value: totalInstituciones });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getTotalBeneficiariosByInstituciones = async (req: Request, res: Response) => {
    try {
        const topInstituciones = await Institucion.findAll({
            where: { estado: true },
            attributes: [['nombre', 'name'], ['totalBeneficiarios', 'value']],
            order: [['totalBeneficiarios', 'DESC']],
            limit: 10
        });

        res.status(200).json({
            status: true,
            value: topInstituciones
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const institucion = await Institucion.findByPk(id);
        if (!institucion) res.status(404).json({
            status: false,
            message: 'Institución no encontrada'
        });
        else res.status(200).json({
            status: true,
            value: institucion
        });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_BY_ID', error);
    }
};

const update = async (req: Request & { user?: any }, res: Response) => {
    try {
        const institucion: IInstitucion = req.body;
        const checkIs = await Institucion.findByPk(institucion.idInstitucion);
        if (!checkIs) {
            res.status(404).json({
                status: false,
                message: 'Institución no encontrada'
            });
            return;
        }

        if (institucion.identificacion.trim() !== checkIs.identificacion.trim()) {
            const exist = await Institucion.findOne({ where: { identificacion: institucion.identificacion } });
            if (exist) {
                res.status(404).json({
                    status: false,
                    message: 'La Identificación/Ruc de la institución ya existe en la base datos.'
                });
                return;
            }
        }

        if (institucion.nombre != checkIs.nombre) {
            const nameExist = await Institucion.findOne({ where: { nombre: institucion.nombre } });
            if (nameExist) {
                res.status(404).json({
                    status: false,
                    message: 'El nombre de la Institución ya existe.'
                });
                return;
            }
        }
        checkIs.nombre = institucion.nombre;
        checkIs.representanteLegal = institucion.representanteLegal;
        checkIs.fechaIngreso = institucion.fechaIngreso;
        checkIs.tipo = institucion.tipo;
        checkIs.idTipoOrg = institucion.idTipoOrg;
        checkIs.idTipoPoblacion = institucion.idTipoPoblacion;
        checkIs.idClasificacion = institucion.idClasificacion;
        checkIs.actividad = institucion.actividad;
        checkIs.totalBeneficiarios = institucion.totalBeneficiarios;
        checkIs.direccion = institucion.direccion;
        checkIs.direccionUrl = institucion.direccionUrl;
        checkIs.latitud = institucion.latitud;
        checkIs.longitud = institucion.longitud;
        checkIs.idSector = institucion.idSector;
        checkIs.nombreContacto = institucion.nombreContacto;
        checkIs.telefono = institucion.telefono;
        checkIs.correo = institucion.correo;
        await checkIs.save();
        await registrarBitacora(req, 'MODIFICACIÓN', entidad,
            `Se actualizó información de la institución ${institucion.nombre}.`)
        res.status(200).json({
            status: true,
            message: 'Datos de la institución actualizados exitosamente',
            value: checkIs
        });
    } catch (error) {
        handleHttp(res, 'ERROR_PUT', error);
    }
};

const updateStatus = async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    try {
        const institucion = await Institucion.findByPk(id);
        if (!institucion) {
            res.status(404).json({
                status: false,
                message: 'Intitución no encontrada. Imposible cambiar de estado.'
            });
            return;
        }

        let status = true;
        if (institucion.estado) status = false;
        institucion.estado = status;
        await institucion.save();
        await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
            `Se cambió el estado de la institución ${institucion.nombre}.`);
        res.status(200).json({
            status: true,
            message: 'Estado de Institución actualizado correctamente'
        });
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE', error);
    }
};

const importJson = async (
    req: Request<{}, {}, any[]>,
    res: Response
) => {
    const institucionesExcel = req.body;

    const transaction = await sequelize.transaction();
    try {
        let contadorLocal = await Contador.findOne({
            where: { nombre: 'instituciones' },
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

        const tiposOrg = await TipoOrg.findAll({ where: { estado: true } });
        const tiposPoblacion = await TipoPoblacion.findAll({ where: { estado: true } });
        const clasificaciones = await Clasificacion.findAll({ where: { estado: true } });
        const sectores = await Sector.findAll({ where: { estado: true } });

        const mapTipoOrg = new Map(tiposOrg.map(t => [limpiarTildes(t.nombre), t.idTipoOrg]));
        const mapTipoPoblacion = new Map(tiposPoblacion.map(t => [limpiarTildes(t.nombre), t.idTipoPoblacion]));
        const mapClasificacion = new Map(clasificaciones.map(c => [limpiarTildes(c.nombre), c.idClasificacion]));
        const mapSector = new Map(sectores.map(s => [limpiarTildes(s.nombre), s.idSector]));

        const rucsExcel = institucionesExcel.map(row => row.ruc?.toString().trim()).filter(ruc => ruc);
        const institucionesExistentes = await Institucion.findAll({
            where: { identificacion: rucsExcel },
            attributes: ['identificacion'],
            transaction
        });

        const rucsExistentesSet = new Set(institucionesExistentes.map(i => i.identificacion));

        for (const row of institucionesExcel) {
            const identificacion = row.ruc?.toString().trim();
            if (rucsExistentesSet.has(identificacion)) continue;

            const idTipoOrg = mapTipoOrg.get(limpiarTildes(row.tipoOrganizacion));
            const idTipoPoblacion = mapTipoPoblacion.get(limpiarTildes(row.tipoPoblacion));
            const idClasificacion = mapClasificacion.get(limpiarTildes(row.clasificacion));
            const idSector = mapSector.get(limpiarTildes(row.sector));

            if (!idTipoOrg) {
                res.status(400).json({
                    status: false,
                    message: `El tipo de organización ${row.tipoOrganizacion} no es válido o no esta registrado.`
                });
                await transaction.rollback();
                return;
            }

            if (!idClasificacion) {
                res.status(400).json({
                    status: false,
                    message: `La clasificación ${row.clasificacion} no es válida o no esta registrada.`
                });
                await transaction.rollback();
                return;
            }

            if (!idTipoPoblacion) {
                res.status(400).json({
                    status: false,
                    message: `El tipo de población ${row.tipoPoblacion} no es válido o no esta registrado.`
                });
                await transaction.rollback();
                return;
            }

            if (!idSector) {
                res.status(400).json({
                    status: false,
                    message: `El sector ${row.sector} no es válido o no esta registrado.`
                });
                await transaction.rollback();
                return;
            }

            siguienteValor += 1;
            const codigo = `${contadorLocal.prefijo}${siguienteValor.toString().padStart(contadorLocal.numFormato, '0')}`;
            const nueva = await Institucion.create({
                codigo,
                nombre: row.nombre.toUpperCase().trim(),
                identificacion,
                representanteLegal: row.representanteLegal.trim(),
                fechaIngreso: normalizarFecha(row.fechaIngreso),
                tipo: 'Institución',
                idTipoOrg,
                idTipoPoblacion,
                idClasificacion,
                actividad: row.actividad.trim(),
                totalBeneficiarios: Number(row.totalBeneficiarios || 0),
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
        await registrarBitacora(req, 'CREACIÓN', entidad, `Se importó las instituciones desde Excel`);

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
    create,
    getAll,
    getTotal,
    getTotalBeneficiariosByInstituciones,
    getById,
    update,
    updateStatus,
    importJson
}