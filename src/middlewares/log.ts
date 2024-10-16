import { Request, Response, NextFunction } from "express";

const log = (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent'];
    console.log('Accediendo desde ' + userAgent);
    next();
}

export { log };