import { inject, injectable } from "tsyringe";
import { UsersRepository } from "../../domain/repositories/users.repository";
import { toUserOutput, UserOutput } from "../dtos/user-output.dto";

export namespace GetMeUseCase {
  export type Input = {
    user_id: string;
  };

  export type Output = UserOutput;

  @injectable()
  export class UseCase {
    constructor(
      @inject("UsersRepository")
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const user = await this.usersRepository.findById(input.user_id);
      return toUserOutput(user);
    }
  }
}
