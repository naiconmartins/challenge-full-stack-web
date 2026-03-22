import { HashProvider } from "@/common/domain/providers/hash-provider";
import { inject, injectable } from "tsyringe";
import { UsersRepository } from "../../domain/repositories/users.repository";
import { toUserOutput, UserOutput } from "../dtos/user-output.dto";

export namespace CreateUserUseCase {
  export type Input = {
    name: string;
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
      await this.usersRepository.conflictingEmail(input.email);

      const hashedPassword = await this.hashProvider.generateHash(
        input.password,
      );

      const user = this.usersRepository.create(input);
      user.password = hashedPassword;
      return toUserOutput(await this.usersRepository.insert(user));
    }
  }
}
