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
            ultimoValor: 1,
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

export async function generarBarcodeEAN13(transaction?: Transaction): Promise<string> {
    let nombre = 'barcodeProducto';
    let contador = await Contador.findOne({
        where: { nombre },
        transaction,
    });

    if (!contador) {
        contador = await Contador.create({
            nombre,
            ultimoValor: 1,
            prefijo: '999',
            numFormato: 9
        }, { transaction });
    } else {
        contador.ultimoValor += 1;
        await contador.save({ transaction });
    }

    const secuencia = contador.ultimoValor.toString().padStart(contador.numFormato, '0');
    const digits12 = `${contador.prefijo}${secuencia}`; 
    
    if (digits12.length !== 12) {
        throw new Error("El código base generado no tiene 12 dígitos (revisa prefijo y numFormato).");
    }

    const checksum = calculateChecksum(digits12);
    const nuevoCodigoEAN13 = digits12 + checksum;
    return nuevoCodigoEAN13;
}

const calculateChecksum = (digits12: string): number => {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(digits12[i], 10);
        sum += (i % 2 === 0) ? digit * 1 : digit * 3;
    }
    const remainder = sum % 10;
    return (10 - remainder) % 10;
};
