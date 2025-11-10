import express, { type NextFunction, type Request, type Response } from "express";
import JSON5 from "json5";
import cors from "cors";
import morgan from "morgan";
import enrollmentRouter from "./routes/enrollmentRoutes";
import { runMigrations } from "./db/migrations";
import { appConfig } from "./config";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware";

declare global {
  namespace Express {
    interface Request {
      rawBody?: string;
    }
  }
}

const FALLBACK_JSON_MIME_TYPES = ["application/json", "text/json", "application/ld+json", "application/vnd.api+json"];

const captureRawBody = (request: Request, response: Response, buffer: Buffer): void => {
  if (buffer.length > 0) {
    request.rawBody = buffer.toString();
  }
};

const isJsonLikeContentType = (contentTypeHeader?: string): boolean => {
  if (!contentTypeHeader) {
    return true;
  }
  const normalizedContentType = contentTypeHeader.split(";")[0].trim().toLowerCase();
  return FALLBACK_JSON_MIME_TYPES.includes(normalizedContentType);
};

export const createApp = () => {
  runMigrations();

  const app = express();

  app.use(requestIdMiddleware);
  app.use(cors());
  app.use(
    express.json({
      limit: "10mb",
      verify: captureRawBody,
      type: (incomingRequest) => isJsonLikeContentType(incomingRequest.headers["content-type"])
    })
  );
  app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    if (
      error instanceof SyntaxError &&
      typeof (error as { status?: unknown }).status === "number" &&
      request.rawBody &&
      isJsonLikeContentType(request.headers["content-type"])
    ) {
      try {
        request.body = JSON5.parse(request.rawBody);
        return next();
      } catch (json5Error) {
        return response.status(400).json({
          code: 400,
          message: "请求体解析失败",
          details: (json5Error as Error).message
        });
      }
    }

    return next(error);
  });
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));

  app.use("/api/enrollments", enrollmentRouter);

  app.use((request, response) => {
    response.status(404).json({ code: 404, message: "资源不存在" });
  });

  app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    response.status(500).json({ code: 500, message: "服务器内部错误" });
  });

  return app;
};

if (require.main === module) {
  const app = createApp();
  app.listen(appConfig.port, () => {
    console.log(`Server started on port ${appConfig.port}`);
  });
}
