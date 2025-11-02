import { body, param, query } from "express-validator";

export const createEnrollmentValidator = [
  body("name").trim().isLength({ min: 1, max: 50 }).withMessage("姓名长度应在 1~50 之间"),
  body("gender")
    .isIn(["男", "女", "其他"])
    .withMessage("性别必须为 男/女/其他"),
  body("course").trim().isLength({ min: 1, max: 100 }).withMessage("课程长度应在 1~100 之间"),
  body("contact").trim().isLength({ min: 5, max: 100 }).withMessage("联系方式长度应在 5~100 之间"),
  body("remarks")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("备注长度需在 1000 字以内")
];

export const updateEnrollmentValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID 必须为正整数"),
  ...createEnrollmentValidator
];

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID 必须为正整数")
];

export const listQueryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page 必须为正整数"),
  query("pageSize")
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage("pageSize 范围 1~200"),
  query("name").optional().trim().isLength({ max: 50 }),
  query("gender").optional().isIn(["男", "女", "其他"]),
  query("course").optional().trim().isLength({ max: 100 }),
  query("contact").optional().trim().isLength({ max: 100 })
];

export const exportQueryValidator = listQueryValidator;
