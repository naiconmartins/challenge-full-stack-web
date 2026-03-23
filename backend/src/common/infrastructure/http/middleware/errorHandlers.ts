import { AppError } from "@/common/domain/errors/app-error";
import { ValidationError } from "@/common/domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({ message: "Internal Server Error" });
}
