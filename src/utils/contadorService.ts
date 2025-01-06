import { Transaction } from "sequelize";
import { Contador } from "../models/contadorModel";

export async function generarCodigo(
    nombre: string,
    transaction?: Transaction): Promise<string> {
    const contador = await Contador.findOne({
        where: { nombre },
        transaction,
    });

    if (!contador) {
        throw new Error(`Contador con nombre "${nombre}" no encontrado.`);
    }
    contador.ultimoValor += 1;
    await contador.save({ transaction });
    const nuevoCodigo =
        `${contador.prefijo}${contador.ultimoValor.toString().padStart(
            contador.numFormato,
            '0')}`;
    return nuevoCodigo;
}