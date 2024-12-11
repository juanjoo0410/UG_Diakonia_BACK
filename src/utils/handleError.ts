import { Response } from "express";

const handleHttp = (res: Response, error: string, errorRaw?: any) => {
    res.status(500).json({
        error,
        details: errorRaw ? errorRaw.message || errorRaw : null,
    });
    //res.status(500);
    //res.send({ error });
    //res.send({ errorRaw });
};

export { handleHttp };