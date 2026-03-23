import { ForbiddenError } from "@/common/domain/errors/forbidden-error";
import { NextFunction, Request, Response } from "express";
import { authorizeRoles } from "./authorizeRoles";

describe("authorizeRoles middleware", () => {
  it("should call next when user role is allowed", () => {
    const req = {
      user: {
        id: "user-id-1",
        role: "ATTENDANT",
      },
    } as Request;
    const next = jest.fn() as NextFunction;

    authorizeRoles("ADMIN", "ATTENDANT")(req, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should throw ForbiddenError when user role is not allowed", () => {
    const req = {
      user: {
        id: "user-id-1",
        role: "ATTENDANT",
      },
    } as Request;
    const next = jest.fn() as NextFunction;

    expect(() => authorizeRoles("ADMIN")(req, {} as Response, next)).toThrow(
      ForbiddenError,
    );
    expect(next).not.toHaveBeenCalled();
  });
});
