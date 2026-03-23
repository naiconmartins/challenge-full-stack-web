import { NotFoundError } from "@/common/domain/errors/not-found-error";
import { UnauthorizedError } from "@/common/domain/errors/unauthorized-error";
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
      let user;
      try {
        user = await this.usersRepository.findById(input.user_id);
      } catch (e) {
        if (e instanceof NotFoundError) {
          throw new UnauthorizedError("Invalid token");
        }
        throw e;
      }

      return toUserOutput(user);
    }
  }
}
