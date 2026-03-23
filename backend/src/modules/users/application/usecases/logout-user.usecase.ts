import { RevokedTokensRepository } from "@/modules/users/domain/repositories/revoked-tokens.repository";
import { inject, injectable } from "tsyringe";

export namespace LogoutUserUseCase {
  export type Input = {
    access_token: string;
  };

  export type Output = void;

  @injectable()
  export class UseCase {
    constructor(
      @inject("RevokedTokensRepository")
      private revokedTokensRepository: RevokedTokensRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.revokedTokensRepository.revokeToken(input.access_token);
    }
  }
}
