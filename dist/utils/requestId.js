"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
const crypto_1 = require("crypto");
const requestIdMiddleware = (request, response, next) => {
    const requestWithId = request;
    requestWithId.requestId = (0, crypto_1.randomUUID)();
    response.setHeader("X-Request-Id", requestWithId.requestId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
