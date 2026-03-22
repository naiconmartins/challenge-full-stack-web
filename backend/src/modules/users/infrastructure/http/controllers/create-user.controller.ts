import { dataValidation } from "@/common/infrastructure/validation/zod";
import { CreateUserUseCase } from "@/modules/users/application/usecases/create-user.usecase";
import { instanceToInstance } from "class-transformer";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { createUserSchema } from "../schemas/create-user.schema";

export async function createUserController(
  request: Request,
  response: Response,
): Promise<Response> {
  const input = dataValidation(createUserSchema, request.body);

  const createUserUseCase: CreateUserUseCase.UseCase =
    container.resolve("CreateUserUseCase");

  const user = await createUserUseCase.execute(input);

  return response.status(201).json(instanceToInstance(user));
}
