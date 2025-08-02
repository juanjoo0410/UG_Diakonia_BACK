import { Request, Response } from 'express';
import { Institucion } from '../models/institucionModel';
import { handleHttp } from '../utils/handleError';
import { Establecimiento } from '../models/establecimientoModel';
import { ProyectoInstitucion } from '../models/proyectoInstitucionModel';
import { Proyecto } from '../models/proyectoModel';

const entidad = 'MAPEO';

const getAll = async (req: Request, res: Response) => {
    try {
        const instituciones = await Institucion.findAll({
            where: { estado: true },
            attributes: ['codigo', 'nombre', 'direccion', 'idSector', 'direccionUrl', 'latitud', 'longitud', 'totalBeneficiarios'],
            include: [{
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
            attributes: ['codigo', 'nombre', 'direccion', 'idSector', 'direccionUrl', 'latitud', 'longitud']
        });

        const institucionesMapped = (instituciones as any[]).map(inst => ({
            ...inst.toJSON(),
            tipo: 'Institución',
            proyectos: inst.proyectos_instituciones?.map((pi: any) => ({ nombre: pi.proyecto?.nombre })).filter(Boolean) ?? []
        }));

        const establecimientosMapped = establecimientos.map(est => ({
            ...est.toJSON(),
            tipo: 'Donante',
            totalBeneficiarios: 0,
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