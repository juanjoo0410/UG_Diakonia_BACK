import { Transaction } from "sequelize";
import { Contador } from "../models/contadorModel";

export async function generarCodigo(
    nombre: string,
    transaction?: Transaction
): Promise<string> {
    let contador = await Contador.findOne({
        where: { nombre },
        transaction,
    });

    if (!contador) {
        contador = await Contador.create({
            nombre,
            ultimoValor: 0,
            prefijo: nombre.slice(0, 3).toUpperCase(),
            numFormato: 4
        }, { transaction });
    } else {
        contador.ultimoValor += 1;
        console.log("CREANDO CODIGO: " + contador.nombre);
        await contador.save({ transaction });
    }

    const nuevoCodigo = `${contador.prefijo}${contador.ultimoValor.toString().padStart(contador.numFormato, '0')}`;
    return nuevoCodigo;
}
