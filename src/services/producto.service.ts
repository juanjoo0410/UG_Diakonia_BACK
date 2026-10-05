import { Op, Transaction } from "sequelize";
import { BaseCRUDService } from "./base-crud.service";
import sequelize from "../config/db";
import { Producto } from "../models/productoModel";
import { generarBarcodeEAN13, generarCodigo } from "../utils/contadorService";
import { ProductoComposicion } from "../models/producto-composicion.model";
import { Ingreso } from "../models/ingresoModel";
import { IngresoDt } from "../models/ingresoDtModel";
import { actualizarStock } from "../utils/stockService";
import { agregarKardex } from "../utils/kardexService";
import { Egreso } from "../models/egresoModel";
import { EgresoDt } from "../models/egresoDtModel";

export class ProductoService extends BaseCRUDService<Producto> {
    constructor() {
        super(Producto);
    }

    public async createProductoCompuesto(data: any): Promise<Producto> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const checkIs = await this.ModelClass.findOne({
                where: { [Op.or]: [{ descripcion: data.descripcion }] }
            });

            if (checkIs) { throw new Error('ENTIDAD_EXISTE') };
            data.codigo = await generarCodigo('productosCompuestos', transaction);
            data.codigoBarras = await generarBarcodeEAN13(transaction);

            //Creación de producto compuesto (kit/combo)
            const newProductoCompuesto = await this.ModelClass.create({
                codigo: data.codigo,
                codigoBarras: data.codigoBarras,
                descripcion: data.descripcion,
                idGrupoProducto: data.idGrupoProducto,
                idSubgrupoProducto: data.idSubgrupoProducto,
                idCategoria: data.idCategoria,
                prest: data.prest,
                unidadesPorPrest: data.unidadesPorPrest,
                pesoPorUnidad: data.pesoPorUnidad,
                unidadPeso: data.unidadPeso,
                precioCosto: data.precioCosto,
                precioTiendita: data.precioTiendita,
                noAplicaDescuento: data.noAplicaDescuento,
                sku: data.sku,
                esCompuesto: data.esCompuesto
            }, { transaction });

            if (!newProductoCompuesto) { throw new Error('ERROR_CREACION_PRODUCTO') };

            if (data.composiciones && data.composiciones.length > 0) {
                const composiciones = data.composiciones.map((u: ProductoComposicion) => ({
                    productoId: newProductoCompuesto.idProducto,
                    composicionId: u.composicionId,
                    cantidad: u.cantidad
                }));

                await ProductoComposicion.bulkCreate(composiciones as any[], { transaction });
            }
            else { throw new Error('ERROR_COMPOSICIONES') };

            //Ingreso de encabezado
            const descripcionIngreso = `CREACIÓN DE PRODUCTO COMPUESTO ${newProductoCompuesto.descripcion}.`;
            const newIngresoHD = await Ingreso.create({
                idTipoTransaccion: data.tipoTransaccionId,
                descripcion: descripcionIngreso,
                idDonante: 0,
                totalPeso: data.totalPeso,
                usuario: data.usuario
            },
                { transaction }
            );
            if (!newIngresoHD) { throw new Error('ERROR_CREACION_INGRESO') };

            const detalleHD = [{
                idIngreso: newIngresoHD.idIngreso ?? 0,
                idProducto: newProductoCompuesto.idProducto ?? 0,
                idBodega: data.bodegaId,
                idUbicacion: data.ubicacionId,
                cantidad: data.cantidad,
                peso: data.totalPeso
            }];

            const dataKardexHD = {
                idDocumento: newIngresoHD.idIngreso,
                tipo: 'INGRESO',
                detalle: descripcionIngreso,
                esIngreso: true
            }

            await IngresoDt.bulkCreate(detalleHD, { transaction });
            await actualizarStock(detalleHD, true, transaction);
            await agregarKardex(dataKardexHD, detalleHD, transaction);

            //Egreso de detalle
            const descripcionEgreso = `CREACIÓN DE PRODUCTO COMPUESTO ${newProductoCompuesto.descripcion}.`;
            const newEgresoDT = await Egreso.create({
                idTipoTransaccion: data.tipoTransaccionId,
                descripcion: descripcionEgreso,
                idInstitucion: 0,
                totalPeso: data.totalPeso,
                usuario: data.usuario
            },
                { transaction }
            );
            if (!newEgresoDT) { throw new Error('ERROR_CREACION_EGRESO') };

            const detallesDT = data.composiciones.map((dt: any) => ({
                idEgreso: newEgresoDT.idEgreso ?? 0,
                idProducto: dt.composicionId,
                idBodega: data.bodegaId,
                idUbicacion: data.ubicacionId,
                cantidad: dt.cantidad,
                peso: dt.totalPeso
            }));

            const dataKardexDT = {
                idDocumento: newEgresoDT.idEgreso,
                tipo: 'EGRESO',
                detalle: descripcionEgreso,
                esIngreso: false
            }
            await EgresoDt.bulkCreate(detallesDT, { transaction });
            await actualizarStock(detallesDT, false, transaction);
            await agregarKardex(dataKardexDT, detallesDT, transaction);

            await transaction.commit();
            return newProductoCompuesto;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    public async updateStockProductoCompuesto(data: any): Promise<Producto> {
        const transaction: Transaction = await sequelize.transaction();
        try {
            const productoCompuesto = await this.ModelClass.findByPk(data.idProducto, { transaction });
            if (!productoCompuesto) throw new Error('ENTIDAD_NO_ENCONTRADA');

            //Ingreso de encabezado
            const descripcionIngreso = `INGRESO PRODUCTO COMPUESTO ${productoCompuesto.descripcion}.`;
            const newIngresoHD = await Ingreso.create({
                idTipoTransaccion: data.tipoTransaccionId,
                descripcion: descripcionIngreso,
                idDonante: 0,
                totalPeso: data.totalPeso,
                usuario: data.usuario
            },
                { transaction }
            );
            if (!newIngresoHD) { throw new Error('ERROR_CREACION_INGRESO') };

            const detalleHD = [{
                idIngreso: newIngresoHD.idIngreso ?? 0,
                idProducto: productoCompuesto.idProducto ?? 0,
                idBodega: data.bodegaId,
                idUbicacion: data.ubicacionId,
                cantidad: data.cantidad,
                peso: data.totalPeso
            }];

            const dataKardexHD = {
                idDocumento: newIngresoHD.idIngreso,
                tipo: 'INGRESO',
                detalle: descripcionIngreso,
                esIngreso: true
            }

            await IngresoDt.bulkCreate(detalleHD, { transaction });
            await actualizarStock(detalleHD, true, transaction);
            await agregarKardex(dataKardexHD, detalleHD, transaction);

            //Egreso de detalle
            const descripcionEgreso = `EGRESO POR PRODUCTO COMPUESTO ${productoCompuesto.descripcion}.`;
            const newEgresoDT = await Egreso.create({
                idTipoTransaccion: data.tipoTransaccionId,
                descripcion: descripcionEgreso,
                idInstitucion: 0,
                totalPeso: data.totalPeso,
                usuario: data.usuario
            },
                { transaction }
            );
            if (!newEgresoDT) { throw new Error('ERROR_CREACION_EGRESO') };

            const detallesDT = data.composiciones.map((dt: any) => ({
                idEgreso: newEgresoDT.idEgreso ?? 0,
                idProducto: dt.composicionId,
                idBodega: data.bodegaId,
                idUbicacion: data.ubicacionId,
                cantidad: dt.cantidad,
                peso: dt.totalPeso
            }));

            const dataKardexDT = {
                idDocumento: newEgresoDT.idEgreso,
                tipo: 'EGRESO',
                detalle: descripcionEgreso,
                esIngreso: false
            }
            await EgresoDt.bulkCreate(detallesDT, { transaction });
            await actualizarStock(detallesDT, false, transaction);
            await agregarKardex(dataKardexDT, detallesDT, transaction);

            await transaction.commit();
            return productoCompuesto;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}