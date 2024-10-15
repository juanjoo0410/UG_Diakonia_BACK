import bcrypt from "bcryptjs";

export const encrypt = async (clave: string) => {
    const hash = await bcrypt.hash(clave, 10);
    return hash;
}

export const compare = async(clave: string, hashPassword: string) => {
    return await bcrypt.compare(clave, hashPassword);
}