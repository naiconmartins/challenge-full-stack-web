import { RevokedTokensRepository } from "@/modules/users/domain/repositories/revoked-tokens.repository";

export class RevokedTokensInMemoryRepository implements RevokedTokensRepository {
  private tokens: Set<string> = new Set();

  async revokeToken(token: string): Promise<void> {
    this.tokens.add(token);
  }

  async isRevoked(token: string): Promise<boolean> {
    return this.tokens.has(token);
  }
}
