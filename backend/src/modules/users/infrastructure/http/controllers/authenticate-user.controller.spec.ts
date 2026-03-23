import { AuthProvider } from "@/common/domain/providers/auth-provider";
import { UsersDataBuilder } from "@/modules/users/testing/helpers/users-data-builder";
import "reflect-metadata";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { authenticateUserController } from "./authenticate-user.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return res as unknown as Response;
}

describe("authenticateUserController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should authenticate the user, generate token with role and return 200", async () => {
    const user = UsersDataBuilder({
      email: "admin@escola.com",
      role: "ADMIN",
    });
    const req = {
      body: {
        email: user.email,
        password: "123456",
      },
    } as Request;
    const res = makeResponse();
    const authenticateUserUseCase = {
      execute: jest.fn().mockResolvedValue(user),
    };
    const authProvider: AuthProvider = {
      generateAuthKey: jest.fn().mockReturnValue({
        access_token: "jwt.token",
      }),
      verifiyAuthKey: jest.fn(),
    };

    jest.spyOn(container, "resolve").mockImplementation(((token: string) => {
      if (token === "AuthenticateUserUseCase") {
        return authenticateUserUseCase;
      }

      if (token === "AuthProvider") {
        return authProvider;
      }

      return undefined;
    }) as never);

    await authenticateUserController(req, res);

    expect(authenticateUserUseCase.execute).toHaveBeenCalledWith({
      email: user.email,
      password: "123456",
    });
    expect(authProvider.generateAuthKey).toHaveBeenCalledWith({
      user_id: user.id,
      role: "ADMIN",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      access_token: "jwt.token",
    });
  });
});
