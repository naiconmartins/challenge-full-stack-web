export interface RevokedTokensRepository {
  revokeToken(token: string): Promise<void>;
  isRevoked(token: string): Promise<boolean>;
}
