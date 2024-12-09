import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/handleJwt";

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtByUser = req.headers.authorization || null;
        const jwt = jwtByUser?.split(' ').pop();
        const isOk = verifyToken(`${jwt}`);
        if (!isOk){
            res.status(401).json({message: "Sesión finalizada, inicie nuevamente"});
            res.send("SESSION_FINISH");
        }
        else {
            console.log(jwtByUser);
            next()
        }
    } catch (error) {
        res.status(400).json({message: "Sesión no válida, inicie nuevamente."});
        res.send("SESSION_NO_VALIDA");
    }
}

export { checkJwt };