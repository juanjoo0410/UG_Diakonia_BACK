import { Request } from 'express';
import { Bitacora } from '../models/bitacoraModel';

export const obtenerIP = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'] as string;
  return forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress || 'IP desconocida';
};

export const obtenerNavegador = (req: Request): string => {
  return req.headers['user-agent'] || 'Navegador desconocido';
};

export const registrarBitacora = async (
  req: Request,
  idUsuario: number,
  accion: string,
  entidad: string,
  descripcion: string
) => {
  try {
    const ip = obtenerIP(req);
    const navegador = obtenerNavegador(req);
    await Bitacora.create({ idUsuario, accion, entidad, descripcion, ip, navegador });
  } catch (error) {
    console.error('Error al registrar en la bitácora:', error);
  }
};