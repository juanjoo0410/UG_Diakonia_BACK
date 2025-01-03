import "dotenv/config";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (idUsuario: number, codigo: string) => {
    const jwt = sign({ idUsuario, codigo }, JWT_SECRET!, { expiresIn: "1h" });
    return jwt;
}

const verifyToken = (jwt: string) => {
    const isOk = verify(jwt, JWT_SECRET!);
    return isOk;
};

export {
    generateToken,
    verifyToken,
};
