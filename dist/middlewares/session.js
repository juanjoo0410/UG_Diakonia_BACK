"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const handleJwt_1 = require("../helpers/handleJwt");
const checkJwt = (req, res, next) => {
    try {
        const jwtByUser = req.headers.authorization || null;
        const jwt = jwtByUser === null || jwtByUser === void 0 ? void 0 : jwtByUser.split(' ').pop();
        const isOk = (0, handleJwt_1.verifyToken)(`${jwt}`);
        if (!isOk) {
            res.status(401).json({ message: "Sesión finalizada, inicie nuevamente" });
            res.send("SESSION_FINISH");
        }
        else {
            console.log(isOk);
            req.user = isOk;
            next();
        }
    }
    catch (error) {
        res.status(400).json({ message: "Sesión no válida, inicie nuevamente." });
        res.send("SESSION_NO_VALIDA");
    }
};
exports.checkJwt = checkJwt;
