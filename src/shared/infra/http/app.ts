import "reflect-metadata";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { createConnection } from "typeorm";

import "express-async-errors";

import swaggerFile from "../../../swagger.json";
import { AppError } from "../../errors/AppError";
import { mainRouter } from "./routes";

import "../../container";

createConnection();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(mainRouter);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };
