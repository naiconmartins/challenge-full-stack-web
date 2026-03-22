import { AuthProvider } from "@/common/domain/providers/auth-provider";
import { dataValidation } from "@/common/infrastructure/validation/zod";
import { AuthenticateUserUseCase } from "@/modules/users/application/usecases/authenticate-user.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { authenticateUserSchema } from "../schemas/authenticate-user.schema";

export async function authenticateUserController(
  request: Request,
  response: Response,
): Promise<Response> {
  const input = dataValidation(authenticateUserSchema, request.body);

  const authenticateUserUseCase: AuthenticateUserUseCase.UseCase =
    container.resolve("AuthenticateUserUseCase");

  const user = await authenticateUserUseCase.execute(input);

  const authProvider: AuthProvider = container.resolve("AuthProvider");

  const { access_token } = authProvider.generateAuthKey(user.id);

  return response.status(200).json({ access_token });
}
