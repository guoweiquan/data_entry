import { Router } from "express";
import {
  listEnrollmentsHandler,
  getEnrollmentHandler,
  createEnrollmentHandler,
  updateEnrollmentHandler,
  deleteEnrollmentHandler,
  exportEnrollmentsHandler
} from "../controllers/enrollmentController";
import {
  createEnrollmentValidator,
  idParamValidator,
  listQueryValidator,
  updateEnrollmentValidator,
  exportQueryValidator
} from "../validators/enrollmentValidator";
import { validationMiddleware } from "../middlewares/validationMiddleware";

const enrollmentRouter = Router();

enrollmentRouter.get(
  "/",
  listQueryValidator,
  validationMiddleware,
  listEnrollmentsHandler
);

enrollmentRouter.get(
  "/export",
  exportQueryValidator,
  validationMiddleware,
  exportEnrollmentsHandler
);

enrollmentRouter.get(
  "/:id",
  idParamValidator,
  validationMiddleware,
  getEnrollmentHandler
);

enrollmentRouter.post(
  "/",
  createEnrollmentValidator,
  validationMiddleware,
  createEnrollmentHandler
);

enrollmentRouter.put(
  "/:id",
  updateEnrollmentValidator,
  validationMiddleware,
  updateEnrollmentHandler
);

enrollmentRouter.delete(
  "/:id",
  idParamValidator,
  validationMiddleware,
  deleteEnrollmentHandler
);

export default enrollmentRouter;
