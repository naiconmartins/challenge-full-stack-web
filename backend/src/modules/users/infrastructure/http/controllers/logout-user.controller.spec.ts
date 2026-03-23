import "reflect-metadata";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { logoutUserController } from "./logout-user.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  return res as unknown as Response;
}

describe("logoutUserController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should extract access token, call use case and return 204", async () => {
    const req = {
      headers: {
        authorization: "Bearer jwt.token",
      },
    } as Request;
    const res = makeResponse();
    const logoutUserUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };

    jest
      .spyOn(container, "resolve")
      .mockReturnValue(logoutUserUseCase as never);

    await logoutUserController(req, res);

    expect(logoutUserUseCase.execute).toHaveBeenCalledWith({
      access_token: "jwt.token",
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
