import { dataSource } from "@/common/infrastructure/typeorm";
import { container } from "tsyringe";
import { CreateStudentUseCase } from "../../application/usecases/create-student.usecase";
import { GetStudentUseCase } from "../../application/usecases/get-student.usecase";
import { SearchStudentUseCase } from "../../application/usecases/search-student.usecase";
import { UpdateStudentUseCase } from "../../application/usecases/update-student.usecase";
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

container.registerSingleton(
  "UpdateStudentUseCase",
  UpdateStudentUseCase.UseCase,
);

container.registerSingleton("GetStudentUseCase", GetStudentUseCase.UseCase);

container.registerSingleton(
  "SearchStudentUseCase",
  SearchStudentUseCase.UseCase,
);
