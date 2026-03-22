import { dataValidation } from "@/common/infrastructure/validation/zod";
import { DeleteStudentUseCase } from "@/modules/students/application/usecases/delete-student.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { deleteStudentParamSchema } from "../schemas/delete-student.schema";

export async function deleteStudentController(
  request: Request,
  response: Response,
) {
  const id = dataValidation(deleteStudentParamSchema, request.params);

  const deleteStudentUseCase: DeleteStudentUseCase.UseCase = container.resolve(
    "DeleteStudentUseCase",
  );

  await deleteStudentUseCase.execute(id);

  return response.status(204).send();
}
