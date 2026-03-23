import { GetMeUseCase } from "@/modules/users/application/usecases/get-me.usecase";
import { instanceToInstance } from "class-transformer";
import { Request, Response } from "express";
import { container } from "tsyringe";

export async function getMeController(
  request: Request,
  response: Response,
): Promise<Response> {
  const getMeUseCase: GetMeUseCase.UseCase = container.resolve("GetMeUseCase");

  const user = await getMeUseCase.execute({ user_id: request.user.id });

  return response.status(200).json(instanceToInstance(user));
}
