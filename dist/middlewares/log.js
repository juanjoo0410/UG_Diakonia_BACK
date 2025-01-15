"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const log = (req, res, next) => {
    const userAgent = req.headers['user-agent'];
    console.log('Accediendo desde ' + userAgent);
    next();
};
exports.log = log;
