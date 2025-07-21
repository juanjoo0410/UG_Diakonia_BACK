import { Request, Response } from 'express';
import { handleHttp } from '../utils/handleError';
import sequelize from "../config/db";
import { registrarBitacora } from '../utils/bitacoraService';
import { IProyecto } from '../interfaces/IProyecto';
import { Proyecto } from '../models/proyectoModel';
import { generarCodigo } from '../utils/contadorService';
import { ProyectoInstitucion } from '../models/proyectoInstitucionModel';

const entidad = 'PROYECTO';

const create = async (
  req: Request<{}, {}, Omit<IProyecto, 'idProyecto' | 'estado'> & { user?: any }>,
  res: Response
) => {
  const transaction = await sequelize.transaction();
  try {
    const { proyectoInstitucion, ...datosProyecto } = req.body;

    const codigo = await generarCodigo('proyectos', transaction);

    const nuevoProyecto = await Proyecto.create({
      ...datosProyecto,
      codigo,
    }, { transaction });

    if (proyectoInstitucion && proyectoInstitucion.length > 0) {
      const relaciones = proyectoInstitucion.map(pi => ({
        idProyecto: nuevoProyecto.idProyecto!,
        idInstitucion: pi.idInstitucion
      }));

      await ProyectoInstitucion.bulkCreate(relaciones, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      status: true,
      message: 'Proyecto creado exitosamente.',
      value: nuevoProyecto
    });

    await registrarBitacora(req, 'CREACIÓN', entidad, `Se creó el proyecto ${nuevoProyecto.nombre}.`);

  } catch (error) {
    await transaction.rollback();
    return handleHttp(res, 'ERROR_POST', error);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const proyectos = await Proyecto.findAll();
    res.status(200).json({ value: proyectos });
  } catch (error) {
    handleHttp(res, 'ERROR_GET_ALL', error);
  }
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) res.status(404).json({
      status: false,
      message: 'Proyecto no encontrado'
    });
    else res.status(200).json({
      status: true,
      value: proyecto
    });
  } catch (error) {
    handleHttp(res, 'ERROR_GET_BY_ID', error);
  }
};

const update = async (req: Request & { user?: any }, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const idProyecto = req.body.idProyecto;
    const { proyectoInstitucion, ...datosProyecto } = req.body;

    const proyectoExistente = await Proyecto.findByPk(datosProyecto.idProyecto);
    if (!proyectoExistente) {
      await transaction.rollback();
      res.status(404).json({
        status: false,
        message: 'Proyecto no encontrado.'
      });
      return;
    }

    await proyectoExistente.update(datosProyecto, { transaction });

    await ProyectoInstitucion.destroy({
      where: { idProyecto },
      transaction
    });

    if (proyectoInstitucion && proyectoInstitucion.length > 0) {
      const nuevasRelaciones = proyectoInstitucion.map((pi: any) => ({
        idProyecto,
        idInstitucion: pi.idInstitucion
      }));
      await ProyectoInstitucion.bulkCreate(nuevasRelaciones, { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      status: true,
      message: 'Proyecto actualizado correctamente.',
      value: proyectoExistente
    });

    await registrarBitacora(req, 'ACTUALIZACIÓN', entidad, `Se actualizó el proyecto ${proyectoExistente.nombre}.`);

  } catch (error) {
    await transaction.rollback();
    handleHttp(res, 'ERROR_PUT', error);
  }
};

const updateStatus = async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  try {
    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      res.status(404).json({
        status: false,
        message: 'Proyecto no encontrado. Imposible cambiar de estado.'
      });
      return;
    }

    let status = true;
    if (proyecto.estado) status = false;
    proyecto.estado = status;
    await proyecto.save();
    await registrarBitacora(req, 'CAMBIO ESTADO', entidad,
      `Se cambió el estado del proyecto ${proyecto.nombre}.`);
    res.status(200).json({
      status: true,
      message: 'Estado de Proyecto actualizado correctamente'
    });
  } catch (error) {
    handleHttp(res, 'ERROR_DELETE', error);
  }
};

export {
  create,
  getAll,
  getById,
  update,
  updateStatus
};