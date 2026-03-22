import { dataSource } from "@/common/infrastructure/typeorm";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "../../application/usecases/authenticate-user.usecase";
import { CreateUserUseCase } from "../../application/usecases/create-user.usecase";
import { UserToken } from "../typeorm/entities/user-tokens.entity";
import { User } from "../typeorm/entities/users.entity";
import { UserTokensTypeormRepository } from "../typeorm/repositories/user-tokens-typeorm.repository";
import { UsersTypeormRepository } from "../typeorm/repositories/users-typeorm.repository";

container.registerSingleton("UsersRepository", UsersTypeormRepository);

container.registerInstance(
  "UsersDefaultRepositoryTypeorm",
  dataSource.getRepository(User),
);

container.registerSingleton("CreateUserUseCase", CreateUserUseCase.UseCase);

container.registerSingleton(
  "AuthenticateUserUseCase",
  AuthenticateUserUseCase.UseCase,
);

container.registerSingleton(
  "UserTokensRepository",
  UserTokensTypeormRepository,
);

container.registerInstance(
  "UserTokensDefaultRepositoryTypeorm",
  dataSource.getRepository(UserToken),
);
