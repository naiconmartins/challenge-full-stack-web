export interface RevokedTokenModel {
  id: string;
  token: string;
  revoked_at: Date;
}
