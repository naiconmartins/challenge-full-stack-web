import { dataSource } from "@/common/infrastructure/typeorm";
import { container } from "tsyringe";
import { CreateStudentUseCase } from "../../application/usecases/create-student.usecase";
import { Student } from "../typeorm/entities/student.entity";
import { StudentsTypeormRepository } from "../typeorm/repositories/students-typeorm.repository";

container.registerInstance(
  "StudentsDefaultTypeormRepository",
  dataSource.getRepository(Student),
);

container.registerSingleton("StudentRepository", StudentsTypeormRepository);

container.registerSingleton(
  "CreateStudentUseCase",
  CreateStudentUseCase.UseCase,
);
