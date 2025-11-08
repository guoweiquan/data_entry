import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";
import { RequestWithRequestId } from "../types/request";

export const requestIdMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const requestWithId = request as RequestWithRequestId;
  requestWithId.requestId = randomUUID();
  response.setHeader("X-Request-Id", requestWithId.requestId);
  next();
};
