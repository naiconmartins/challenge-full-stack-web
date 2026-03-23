import { LogoutUserUseCase } from "@/modules/users/application/usecases/logout-user.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";

export async function logoutUserController(
  request: Request,
  response: Response,
): Promise<Response> {
  const [, access_token] = request.headers.authorization!.split(" ");

  const logoutUserUseCase: LogoutUserUseCase.UseCase =
    container.resolve("LogoutUserUseCase");

  await logoutUserUseCase.execute({ access_token });

  return response.status(204).send();
}
