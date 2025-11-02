import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validationMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const errors = validationResult(request);
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
