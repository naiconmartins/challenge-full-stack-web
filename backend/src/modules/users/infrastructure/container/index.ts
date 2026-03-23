import { dataSource } from "@/common/infrastructure/typeorm";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "../../application/usecases/authenticate-user.usecase";
import { CreateUserUseCase } from "../../application/usecases/create-user.usecase";
import { GetMeUseCase } from "../../application/usecases/get-me.usecase";
import { LogoutUserUseCase } from "../../application/usecases/logout-user.usecase";
import { RevokedToken } from "../typeorm/entities/revoked-token.entity";
import { User } from "../typeorm/entities/users.entity";
import { RevokedTokensTypeormRepository } from "../typeorm/repositories/revoked-tokens-typeorm.repository";
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

container.registerSingleton("GetMeUseCase", GetMeUseCase.UseCase);

container.registerSingleton(
  "RevokedTokensRepository",
  RevokedTokensTypeormRepository,
);

container.registerInstance(
  "RevokedTokensDefaultRepositoryTypeorm",
  dataSource.getRepository(RevokedToken),
);

container.registerSingleton("LogoutUserUseCase", LogoutUserUseCase.UseCase);
