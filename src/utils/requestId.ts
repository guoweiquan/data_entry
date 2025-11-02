import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

export const requestIdMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  request.requestId = randomUUID();
  response.setHeader("X-Request-Id", request.requestId);
  next();
};
