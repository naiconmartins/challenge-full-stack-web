import { UnauthorizedError } from "@/common/domain/errors/unauthorized-error";
import { AuthProvider } from "@/common/domain/providers/auth-provider";
import { RevokedTokensRepository } from "@/modules/users/domain/repositories/revoked-tokens.repository";
import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { isAuthenticated } from "./isAuthenticated";

describe("isAuthenticated middleware", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw UnauthorizedError when token is missing", async () => {
    const req = {
      headers: {},
    } as Request;

    await expect(
      isAuthenticated(req, {} as Response, jest.fn() as NextFunction),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should set request user and call next when token is valid", async () => {
    const req = {
      headers: {
        authorization: "Bearer valid.jwt.token",
      },
    } as Request;
    const next = jest.fn() as NextFunction;
    const authProvider: AuthProvider = {
      generateAuthKey: jest.fn(),
      verifiyAuthKey: jest.fn().mockReturnValue({
        user_id: "user-id-1",
        role: "ATTENDANT",
      }),
    };
    const revokedTokensRepository: RevokedTokensRepository = {
      revokeToken: jest.fn(),
      isRevoked: jest.fn().mockResolvedValue(false),
    };

    jest.spyOn(container, "resolve").mockImplementation(((token: string) => {
      if (token === "AuthProvider") {
        return authProvider;
      }

      if (token === "RevokedTokensRepository") {
        return revokedTokensRepository;
      }

      return undefined;
    }) as never);

    await isAuthenticated(req, {} as Response, next);

    expect(authProvider.verifiyAuthKey).toHaveBeenCalledWith("valid.jwt.token");
    expect(revokedTokensRepository.isRevoked).toHaveBeenCalledWith(
      "valid.jwt.token",
    );
    expect(req.user).toStrictEqual({
      id: "user-id-1",
      role: "ATTENDANT",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should throw UnauthorizedError when token payload does not contain user id", async () => {
    const req = {
      headers: {
        authorization: "Bearer invalid.jwt.token",
      },
    } as Request;
    const authProvider: AuthProvider = {
      generateAuthKey: jest.fn(),
      verifiyAuthKey: jest.fn().mockReturnValue({
        user_id: "",
        role: "ATTENDANT",
      }),
    };
    const revokedTokensRepository: RevokedTokensRepository = {
      revokeToken: jest.fn(),
      isRevoked: jest.fn().mockResolvedValue(false),
    };

    jest.spyOn(container, "resolve").mockImplementation(((token: string) => {
      if (token === "AuthProvider") {
        return authProvider;
      }

      if (token === "RevokedTokensRepository") {
        return revokedTokensRepository;
      }

      return undefined;
    }) as never);

    await expect(
      isAuthenticated(req, {} as Response, jest.fn() as NextFunction),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("should throw UnauthorizedError when token has been revoked", async () => {
    const req = {
      headers: {
        authorization: "Bearer revoked.jwt.token",
      },
    } as Request;
    const authProvider: AuthProvider = {
      generateAuthKey: jest.fn(),
      verifiyAuthKey: jest.fn().mockReturnValue({
        user_id: "user-id-1",
        role: "ADMIN",
      }),
    };
    const revokedTokensRepository: RevokedTokensRepository = {
      revokeToken: jest.fn(),
      isRevoked: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(container, "resolve").mockImplementation(((token: string) => {
      if (token === "AuthProvider") {
        return authProvider;
      }

      if (token === "RevokedTokensRepository") {
        return revokedTokensRepository;
      }

      return undefined;
    }) as never);

    await expect(
      isAuthenticated(req, {} as Response, jest.fn() as NextFunction),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
