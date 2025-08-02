import { Request, Response } from 'express';
import { Institucion } from '../models/institucionModel';
import { handleHttp } from '../utils/handleError';
import { Establecimiento } from '../models/establecimientoModel';
import { ProyectoInstitucion } from '../models/proyectoInstitucionModel';
import { Proyecto } from '../models/proyectoModel';
import { TipoOrg } from '../models/tipoOrgModel';
import { Sector } from '../models/sectorModel';
import { Donante } from '../models/donanteModel';
import { TipoPoblacion } from '../models/tipoPoblacionModel';

const entidad = 'MAPEO';

const getAll = async (req: Request, res: Response) => {
    try {
        const instituciones = await Institucion.findAll({
            where: { estado: true },
            attributes: ['codigo', 'nombre', 'direccion', 'idSector', 'direccionUrl', 'latitud', 'longitud', 'actividad', 'totalBeneficiarios'],
            include: [
                {
                    model: TipoOrg,
                    as: 'tipoOrg',
                    attributes: ['nombre']
                },
                {
                    model: TipoPoblacion,
                    as: 'tipoPoblacion',
                    attributes: ['nombre']
                },
                {
                    model: Sector,
                    as: 'sector',
                    attributes: ['nombre']
                },
                {
                    model: ProyectoInstitucion,
                    as: 'proyectos_instituciones',
                    include: [{
                        model: Proyecto,
                        as: 'proyecto',
                        attributes: ['nombre']
                    }]
                }]
        });

        const establecimientos = await Establecimiento.findAll({
            where: { estado: true },
            attributes: ['codigo', 'nombre', 'direccion', 'idSector', 'direccionUrl', 'latitud', 'longitud'],
            include: [
                {
                    model: Donante,
                    as: 'donante',
                    attributes: ['abreviatura']
                },
                {
                    model: Sector,
                    as: 'sector',
                    attributes: ['nombre']
                },]
        });

        const institucionesMapped = (instituciones as any[]).map(inst => ({
            ...inst.toJSON(),
            tipo: 'Institución',
            donante: { abreviatura: ''},
            proyectos: inst.proyectos_instituciones?.map((pi: any) => ({ nombre: pi.proyecto?.nombre })).filter(Boolean) ?? []
        }));

        const establecimientosMapped = establecimientos.map(est => ({
            ...est.toJSON(),
            tipo: 'Donante',
            actividad: '',
            totalBeneficiarios: 0,
            tipoOrg: { nombre: ''},
            tipoPoblacion: { nombre: ''},
            proyectos: []
        }));

        const union = [...institucionesMapped, ...establecimientosMapped];

        res.status(200).json({ value: union });
    } catch (error) {
        handleHttp(res, 'ERROR_GET_ALL', error);
    }
};

export {
    getAll
}