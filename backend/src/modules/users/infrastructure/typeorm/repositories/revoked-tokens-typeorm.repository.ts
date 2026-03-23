import { RevokedTokenModel } from "@/modules/users/domain/models/revoked-token.model";
import { RevokedTokensRepository } from "@/modules/users/domain/repositories/revoked-tokens.repository";
import { inject, injectable } from "tsyringe";
import { Repository } from "typeorm";

@injectable()
export class RevokedTokensTypeormRepository implements RevokedTokensRepository {
  constructor(
    @inject("RevokedTokensDefaultRepositoryTypeorm")
    private revokedTokensRepository: Repository<RevokedTokenModel>,
  ) {}

  async revokeToken(token: string): Promise<void> {
    const entry = this.revokedTokensRepository.create({ token });
    await this.revokedTokensRepository.save(entry);
  }

  async isRevoked(token: string): Promise<boolean> {
    const count = await this.revokedTokensRepository.countBy({ token });
    return count > 0;
  }
}
