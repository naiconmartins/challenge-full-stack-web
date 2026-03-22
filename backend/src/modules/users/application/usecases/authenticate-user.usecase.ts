import { InvalidCredentialsError } from "@/common/domain/errors/invalid-credentials-error";
import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { HashProvider } from "@/common/domain/providers/hash-provider";
import { inject, injectable } from "tsyringe";
import { UsersRepository } from "../../domain/repositories/users.repository";
import { toUserOutput, UserOutput } from "../dtos/user-output.dto";

export namespace AuthenticateUserUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  @injectable()
  export class UseCase {
    constructor(
      @inject("UsersRepository")
      private usersRepository: UsersRepository,
      @inject("HashProvider")
      private hashProvider: HashProvider,
    ) {}
    async execute(input: Input): Promise<Output> {
      if (!input.email || !input.password) {
        throw new InvalidCredentialsError("Invalid credentials");
      }

      let user;
      try {
        user = await this.usersRepository.findByEmail(input.email);
      } catch (e) {
        if (e instanceof NotFoundError) {
          throw new InvalidCredentialsError("Invalid credentials");
        }
        throw e;
      }

      const passwordMatch = await this.hashProvider.compareHash(
        input.password,
        user.password,
      );
      if (!passwordMatch) {
        throw new InvalidCredentialsError("Invalid credentials");
      }

      return toUserOutput(user);
    }
  }
}
