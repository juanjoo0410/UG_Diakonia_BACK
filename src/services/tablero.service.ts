import { generarCodigo } from '../utils/contadorService';
import sequelize from '../config/db';
import { Transaction } from 'sequelize';
import { BaseCRUDService } from './base-crud.service';
import { ITablero } from '../interfaces/tablero.interface';
import { Tablero } from '../models/tablero.model';
import { TableroUsuario } from '../models/tablero-usuario.model';

type TableroCreationData = Omit<ITablero, 'id' | 'estado'>;

export class TableroService extends BaseCRUDService<Tablero> {
    constructor() {
        super(Tablero);
    }

    public async createTablero(tableroData: TableroCreationData): Promise<Tablero> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { nombre: tableroData.nombre },
                transaction: transaction,
            });
            if (checkIs) {
                throw new Error('ENTIDAD_EXISTE');
            }
            tableroData.codigo = await generarCodigo('tableros', transaction);
            const newTablero = await this.ModelClass.create(tableroData, { transaction });

            if (!tableroData.todos && tableroData.tablerosUsuarios && tableroData.tablerosUsuarios.length > 0) {
                const detalleUsuarios = tableroData.tablerosUsuarios.map(u => ({
                    idTablero: newTablero.id,
                    idUsuario: u.idUsuario
                }));

                await TableroUsuario.bulkCreate(detalleUsuarios as any[], { transaction });
            }

            await transaction.commit();
            return newTablero;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateTablero(tableroData: ITablero): Promise<Tablero> {
        const transaction = await sequelize.transaction();
        try {
            const tableroToUpdate = await this.ModelClass.findByPk(tableroData.id, { transaction });
            if (!tableroToUpdate) throw new Error('ENTIDAD_NO_ENCONTRADA');

            if (tableroData.nombre.toLocaleUpperCase() !== tableroToUpdate.nombre.toLocaleUpperCase()) {
                const nameExist = await this.ModelClass.findOne({
                    where: { nombre: tableroData.nombre },
                    transaction
                });
                if (nameExist) throw new Error('NOMBRE_DE_ENTIDAD_EXISTE');
            }

            tableroToUpdate.nombre = tableroData.nombre;
            tableroToUpdate.descripcion = tableroData.descripcion;
            tableroToUpdate.url = tableroData.url;
            tableroToUpdate.todos = tableroData.todos;

            const updatedTablero = await tableroToUpdate.save({ transaction });

            await TableroUsuario.destroy({
                where: { idTablero: tableroData.id },
                transaction
            });

            if (!tableroData.todos && tableroData.tablerosUsuarios && tableroData.tablerosUsuarios.length > 0) {
                const detalleUsuarios = tableroData.tablerosUsuarios.map(u => ({
                    idTablero: tableroData.id,
                    idUsuario: u.idUsuario
                }));

                await TableroUsuario.bulkCreate(detalleUsuarios as any[], { transaction });
            }

            await transaction.commit();
            return updatedTablero;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateTableroStatus(id: number | string): Promise<Tablero> {
        const tablero = await this.ModelClass.findByPk(id);
        if (!tablero) throw new Error('ENTIDAD_NO_ENCONTRADA');

        let newStatus = true;
        if (tablero.estado) newStatus = false;

        tablero.estado = newStatus;
        const updatedTablero = await tablero.save();

        return updatedTablero;
    }
}