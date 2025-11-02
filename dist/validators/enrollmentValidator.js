"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportQueryValidator = exports.listQueryValidator = exports.idParamValidator = exports.updateEnrollmentValidator = exports.createEnrollmentValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createEnrollmentValidator = [
    (0, express_validator_1.body)("name").trim().isLength({ min: 1, max: 50 }).withMessage("姓名长度应在 1~50 之间"),
    (0, express_validator_1.body)("gender")
        .isIn(["男", "女", "其他"])
        .withMessage("性别必须为 男/女/其他"),
    (0, express_validator_1.body)("course").trim().isLength({ min: 1, max: 100 }).withMessage("课程长度应在 1~100 之间"),
    (0, express_validator_1.body)("contact").trim().isLength({ min: 5, max: 100 }).withMessage("联系方式长度应在 5~100 之间"),
    (0, express_validator_1.body)("remarks")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage("备注长度需在 1000 字以内")
];
exports.updateEnrollmentValidator = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).withMessage("ID 必须为正整数"),
    ...exports.createEnrollmentValidator
];
exports.idParamValidator = [
    (0, express_validator_1.param)("id").isInt({ min: 1 }).withMessage("ID 必须为正整数")
];
exports.listQueryValidator = [
    (0, express_validator_1.query)("page").optional().isInt({ min: 1 }).withMessage("page 必须为正整数"),
    (0, express_validator_1.query)("pageSize")
        .optional()
        .isInt({ min: 1, max: 200 })
        .withMessage("pageSize 范围 1~200"),
    (0, express_validator_1.query)("name").optional().trim().isLength({ max: 50 }),
    (0, express_validator_1.query)("gender").optional().isIn(["男", "女", "其他"]),
    (0, express_validator_1.query)("course").optional().trim().isLength({ max: 100 }),
    (0, express_validator_1.query)("contact").optional().trim().isLength({ max: 100 })
];
exports.exportQueryValidator = exports.listQueryValidator;
