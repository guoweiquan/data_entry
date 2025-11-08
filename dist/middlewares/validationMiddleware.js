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
            errors: errors.array().map((error) => {
                if (error.type === "field") {
                    return {
                        field: error.path,
                        location: error.location,
                        message: error.msg
                    };
                }
                if (error.type === "unknown_fields") {
                    const unknownFieldPaths = error.fields
                        .map((fieldInstance) => fieldInstance.path)
                        .filter(Boolean);
                    return {
                        field: unknownFieldPaths.length > 0
                            ? unknownFieldPaths.join(", ")
                            : "unknown_fields",
                        message: error.msg ?? "存在未定义的字段"
                    };
                }
                if (error.type === "alternative") {
                    return {
                        field: "alternative",
                        message: error.msg ?? "候选校验全部失败",
                        details: error.nestedErrors.map((nestedError) => ({
                            field: nestedError.path,
                            location: nestedError.location,
                            message: nestedError.msg
                        }))
                    };
                }
                if (error.type === "alternative_grouped") {
                    return {
                        field: "alternative_grouped",
                        message: error.msg ?? "候选校验全部失败",
                        details: error.nestedErrors.map((group) => group.map((nestedError) => ({
                            field: nestedError.path,
                            location: nestedError.location,
                            message: nestedError.msg
                        })))
                    };
                }
                return {
                    field: "validation",
                    message: "校验失败"
                };
            })
        });
        return;
    }
    next();
};
exports.validationMiddleware = validationMiddleware;
