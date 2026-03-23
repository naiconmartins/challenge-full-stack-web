import { AppError } from "@/common/domain/errors/app-error";
import { ValidationError } from "@/common/domain/errors/validation-error";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandlers";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return res as unknown as Response;
}

describe("errorHandler", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return validation response for ValidationError", () => {
    const res = makeResponse();
    const error = new ValidationError([
      {
        field: "email",
        message: "Invalid email",
      },
    ]);

    errorHandler(error, {} as Request, res, jest.fn() as NextFunction);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      message: error.message,
      errors: [{ field: "email", message: "Invalid email" }],
    });
  });

  it("should return app error response for AppError", () => {
    const res = makeResponse();
    const error = new AppError("Conflict", 409);

    errorHandler(error, {} as Request, res, jest.fn() as NextFunction);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Conflict",
    });
  });

  it("should return internal server error for unknown errors", () => {
    const res = makeResponse();
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    errorHandler(
      new Error("unexpected"),
      {} as Request,
      res,
      jest.fn() as NextFunction,
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
