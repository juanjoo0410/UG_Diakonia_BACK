"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttp = void 0;
const handleHttp = (res, error, errorRaw) => {
    res.status(500).json({
        error,
        details: errorRaw ? errorRaw.message || errorRaw : null,
    });
    //res.status(500);
    //res.send({ error });
    //res.send({ errorRaw });
};
exports.handleHttp = handleHttp;
