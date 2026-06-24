/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import envVars from "../../config/env";
import status from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from global error handler:", err);
  }

  const statusCode: number = status.INTERNAL_SERVER_ERROR;
  const message: string = "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.message,
  });
};

export default globalErrorHandler;
