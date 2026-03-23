import { UnauthorizedError } from "@/common/domain/errors/unauthorized-error";
import { AuthProvider } from "@/common/domain/providers/auth-provider";
import { RevokedTokensRepository } from "@/modules/users/domain/repositories/revoked-tokens.repository";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

export async function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError("Token is missing");
  }

  const [, access_token] = authHeader.split(" ");
  const authProvider: AuthProvider = container.resolve("AuthProvider");
  const { user_id } = authProvider.verifiyAuthKey(access_token);
  if (!user_id) {
    throw new UnauthorizedError("Invalid token");
  }

  const revokedTokensRepository: RevokedTokensRepository = container.resolve(
    "RevokedTokensRepository",
  );
  const revoked = await revokedTokensRepository.isRevoked(access_token);
  if (revoked) {
    throw new UnauthorizedError("Token has been revoked");
  }

  req.user = {
    id: user_id,
  };

  return next();
}
