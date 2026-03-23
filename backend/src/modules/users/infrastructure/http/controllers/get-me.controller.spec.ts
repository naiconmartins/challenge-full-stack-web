import { UsersDataBuilder } from "@/modules/users/testing/helpers/users-data-builder";
import { Request, Response } from "express";
import "reflect-metadata";
import { container } from "tsyringe";
import { getMeController } from "./get-me.controller";

function makeResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  return res as unknown as Response;
}

describe("getMeController", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call use case with authenticated user id and return 200", async () => {
    const user = UsersDataBuilder({
      role: "ADMINISTRATIVE",
    });
    const req = {
      user: {
        id: user.id,
        role: "ADMINISTRATIVE",
      },
    } as Request;
    const res = makeResponse();
    const getMeUseCase = {
      execute: jest.fn().mockResolvedValue(user),
    };

    jest.spyOn(container, "resolve").mockReturnValue(getMeUseCase as never);

    await getMeController(req, res);

    expect(getMeUseCase.execute).toHaveBeenCalledWith({
      user_id: user.id,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
        role: "ADMINISTRATIVE",
      }),
    );
  });
});
