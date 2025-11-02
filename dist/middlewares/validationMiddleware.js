"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validationMiddleware = (request, response, next) => {
    const errors = (0, express_validator_1.validationResult)(request);
    if (!errors.isEmpty()) {
        response.status(400).json({
            code: 400,
            message: "参数校验失败",
            errors: errors.array().map((error) => ({
                field: error.param,
                message: error.msg
            }))
        });
        return;
    }
    next();
};
exports.validationMiddleware = validationMiddleware;
