import express from "express";
import cors from "cors";
import morgan from "morgan";
import enrollmentRouter from "./routes/enrollmentRoutes";
import { runMigrations } from "./db/migrations";
import { appConfig } from "./config";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware";

export const createApp = () => {
  runMigrations();

  const app = express();

  app.use(requestIdMiddleware);
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));

  app.use("/api/enrollments", enrollmentRouter);

  app.use((request, response) => {
    response.status(404).json({ code: 404, message: "资源不存在" });
  });

  app.use((error: unknown, request: express.Request, response: express.Response, next: express.NextFunction) => {
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
